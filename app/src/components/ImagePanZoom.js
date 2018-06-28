import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Image from './Image';
import { CP_TYPES, CP_MODES, joinedPoints } from '../state/utils/controlpoints';
import config from '../config';

// https://github.com/rexxars/react-element-pan/blob/master/src/element-pan.js
class ImagePanZoom extends Component {

  static propTypes = {
    clearAutomaticControlPoints: PropTypes.func,
    image: PropTypes.object,
    markers: PropTypes.array,
    selectedMarker: PropTypes.any,
    selectedImage: PropTypes.string,
    onImageDragged: PropTypes.func,
    onMarkerToggle: PropTypes.func,
    onMarkerDelete: PropTypes.func,
    onMarkerLock: PropTypes.func,
    highlightedControlPoints: PropTypes.array,
    highlightControlPoint: PropTypes.func,
    addControlPoint: PropTypes.func,

    markerDraggable: PropTypes.bool,
    scrollWheelZoom: PropTypes.bool,
    doubleClickZoom: PropTypes.bool,
    mode: PropTypes.string
  }

  static defaultProps = {
    clearAutomaticControlPoints: () => {},
    image: null,
    markers: [],
    selectedMarker: null,
    selectedImage: null,
    onImageDragged: () => {},
    onMarkerToggle: () => {},
    onMarkerDelete: () => {},
    onMarkerLock: () => {},
    highlightControlPoint: () => {},
    addControlPoint: () => {},

    markerDraggable: false,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    mode: ''
  }

  constructor(props) {
    super(props);

    this.state = {
      draggingImage: false,
      draggingMarker: false,
      marker: null,
      scale: null,
      minScale: 0,
      imageWidth: 0,
      imageHeight: 0,
      scrollLeft: 0,
      scrollTop: 0,
      imageData: {
        src: null,
        width: 0,
        height: 0,
        orientation: 1
      }
    };

    this.onDownHandler = this.onDownHandler.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);

    this.onWheel = this.onWheel.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.image !== nextProps.image) {
      this.reset();
    }

    if (this.props.windowSize !== nextProps.windowSize) {
      this.updateImageContainerSize();
    }

    if (!this.props.visible && nextProps.visible) {
      this.onVisible(nextProps);
    }

    if (this.props.visible && !nextProps.visible) {
      this.onNotVisible();
    }
  }

  componentDidMount() {
    this.updateImageContainerSize();
  }

  componentDidUpdate() {
    const { scrollLeft, scrollTop } = this.state;

    if (this.el) {
      this.el.scrollLeft = scrollLeft;
      this.el.scrollTop = scrollTop;
    }
  }

  componentWillUnmount() {}

  reset() {
    if (this.el) {
      this.el.scrollLeft = 0;
      this.el.scrollTop = 0
    }

    this.setState({
      draggingImage: false,
      draggingMarker: false
    });
  }

  onDoubleClick(evt) {
    const { doubleClickZoom } = this.props;
    if (!doubleClickZoom) return;

    const { scale, minScale, imageData } = this.state;
    if (!imageData.src) return;

    let max = config.image_slider_zoom_max || 2;

    let shiftKey = evt.shiftKey;

    let zoomScaleModifier = 0.3;
    let newScale = (shiftKey) ? scale + -(zoomScaleModifier) : scale + zoomScaleModifier;
    newScale = Math.min(Math.max(newScale, minScale), max);
    this.onSliderChange(newScale);
  }

  onWheel(evt) {
    evt.preventDefault();

    const { scrollWheelZoom } = this.props;
    if (!scrollWheelZoom) return;

    const { scale, minScale, imageData } = this.state;
    if (!imageData.src) return;

    let max = config.image_slider_zoom_max || 2;

    let zoomScaleSensitivity = 0.1;
    let delta = evt.deltaY || 1;
    let now = Date.now();
    let timeDelta = now - (this.lastMouseWheelEventTime || 0);
    let divider = 3 + Math.max(0, 30 - timeDelta);

    this.lastMouseWheelEventTime = now;

    // Make empirical adjustments for browsers that give deltaY in pixels (deltaMode=0)
    if ('deltaMode' in evt && evt.deltaMode === 0 && evt.wheelDelta) {
      delta = evt.deltaY === 0 ? 0 :  Math.abs(evt.wheelDelta) / evt.deltaY;
    }

    delta = -0.3 < delta && delta < 0.3 ? delta : (delta > 0 ? 1 : -1) * Math.log(Math.abs(delta) + 10) / divider;

    let zoom = Math.pow(1 + zoomScaleSensitivity, (-1) * delta);

    let newScale = zoom * scale;
    newScale = Math.min(Math.max(newScale, minScale), max);
    this.onSliderChange(newScale);
  }

  updateImageContainerSize() {
    if (!this.el) return;

    let w = this.el.parentNode.offsetWidth;
    let h = this.el.parentNode.offsetHeight;

    this.el.style.width = `${w}px`;
    this.el.style.height = `${h}px`;
  }

  getMousePosition(evt) {
    let rect = this.el.getBoundingClientRect();

    let x = typeof evt.clientX === 'undefined' ? evt.changedTouches[0].clientX : evt.clientX;
    let y = typeof evt.clientY === 'undefined' ? evt.changedTouches[0].clientY : evt.clientY;

    return [x - rect.left, y - rect.top];
  }

  getCenter() {
    if (!this.el) return [0,0];

    let rect = this.el.getBoundingClientRect();
    let x = this.el.scrollLeft + (rect.width / 2);
    let y = this.el.scrollTop + (rect.height / 2);
    return [x,y]
  }

  transformPosition(x, y, atNative) {
    const { imageData, imageWidth, imageHeight } = this.state;

    const dx = imageWidth / imageData.width;
    const dy = imageHeight / imageData.height;

    if (atNative) {
      return [x * (1 / dx), y * (1 / dy)];
    }

    return [x * dx, y * dx];
  }

  addPanningEvents() {
    window.addEventListener('mousemove', this.onDragMove);
    window.addEventListener('touchmove', this.onDragMove);
    window.addEventListener('mouseup', this.onDragStop);
    window.addEventListener('touchend', this.onDragStop);
  }

  removePanningEvents() {
    window.removeEventListener('mousemove', this.onDragMove);
    window.removeEventListener('touchmove', this.onDragMove);
    window.removeEventListener('mouseup', this.onDragStop);
    window.removeEventListener('touchend', this.onDragStop);
  }

  onDownHandler(evt) {
    const { mode, addControlPoint, image } = this.props;
    evt.preventDefault();

    if (!evt.target) return;
    if (evt.target.className.indexOf('action') >= 0) return;

    let bounds = evt.target.getBoundingClientRect();
    let [startX, startY] = this.getMousePosition(evt);

    // check if marker was clicked
    this._marker = evt.target.className.indexOf('image-point') > -1 ? evt.target : null;
    const mouseDownOnMarker = this._marker ? true : false;

    let markerId = null;
    let marker_selected = null;
    if (mouseDownOnMarker) {
      marker_selected = +evt.target.dataset.selected;
      markerId = evt.target.dataset.id;
    }

    if (mode === CP_MODES.ADDING) {
      let [mx,my] = this.getCoordinatesFromMousePosition(evt);
      addControlPoint([mx, my], image.name, true);
      return;
    }

    if (this._marker && !marker_selected) {
      // If we're clicking on a marker, select it
      this.props.onMarkerToggle(markerId);
    }
    if (!this._marker && this.state.markerId) {
      // If we're not clicking on a marker but one was selected, unselect it
      this.props.onMarkerToggle(this.state.markerId);
    }

    this.addPanningEvents();


    var state = {
      draggingImage: true,
      marker: mouseDownOnMarker,
      markerId,

      elHeight: this.el.clientHeight,
      elWidth: this.el.clientWidth,

      startX,
      startY,

      scrollX: this.el.scrollLeft,
      scrollY: this.el.scrollTop,

      maxX: bounds.width,
      maxY: bounds.height
    };

    this._dragged = false;

    this.setState(state);
  }

  onDragMove(evt) {
    if (!this.state.draggingImage) {
      return;
    }

    this._dragged = true;

    let [x, y] = this.getMousePosition(evt);

    if (this._marker) {
      let left = this.el.scrollLeft;
      let top = this.el.scrollTop;

      // get native pos
      let [nx, ny] = this.transformPosition(left + x, top + y, true);

      // pos accounting for scale
      [nx, ny] = this.transformPosition(nx, ny);

      // apply to marker
      this._marker.style.left = `${nx}px`;
      this._marker.style.top = `${ny}px`;
      this.setState({ draggingMarker: true });
      return;
    }

    // Letting the browser automatically stop on scrollHeight
    // gives weird bugs where some extra pixels are showing.
    // Substracting the height/width of the container from the
    // inner content seems to do the trick.
    this.el.scrollLeft = Math.min(
      this.state.maxX - this.state.elWidth,
      this.state.scrollX - (x - this.state.startX)
    );

    this.el.scrollTop = Math.min(
      this.state.maxY - this.state.elHeight,
      this.state.scrollY - (y - this.state.startY)
    );
  }

  getCoordinatesFromMousePosition(evt) {
    let [x, y] = this.getMousePosition(evt);

    let left = this.el.scrollLeft;
    let top = this.el.scrollTop;

    let [nx, ny] = this.transformPosition(left + x, top + y, true);
    let center = this.getNativeCenter(left, top, this.state.scale);

    return [nx, ny, center];
  }

  onDragStop(evt) {
    const { mode } = this.props;

    this.removePanningEvents();

    if (!this._dragged || mode === 'adding') return;

    let [x, y] = this.getMousePosition(evt);

    let left = this.el.scrollLeft;
    let top = this.el.scrollTop;

    let [nx, ny] = this.transformPosition(left + x, top + y, true);
    let center = this.getNativeCenter(left, top, this.state.scale);

    let markerId = null;

    if (this._marker) {
      this._marker.style.left = `${nx}px`;
      this._marker.style.top = `${ny}px`;
      markerId = this._marker.dataset.id;
    }

    this._marker = null;

    this.setState({
      draggingImage: false,
      draggingMarker: false,
      marker: false,
      scrollLeft: left,
      scrollTop: top
    }, () => {
      if (markerId) {
        this.props.onMarkerDragged(markerId, [nx, ny]);
      } else {
        this.props.onImageDragged(center);
      }
    });
  }

  onSliderChange(value) {
    const { imageData } = this.state;
    if (!imageData.src) return;

    let scale = value;
    let [imageWidth, imageHeight, scrollLeft, scrollTop] = this.scaleImage(imageData.width, imageData.height, scale);
    this.setState({ scale, imageWidth, imageHeight, scrollLeft, scrollTop });
  }

  getNativeCenter(left, top, scale) {
    let w2 = this.el.offsetWidth / 2;
    let h2 = this.el.offsetHeight / 2;

    let x = (left + w2) * (1/scale);
    let y = (top + h2) * (1/scale);
    return [x, y];
  }

  scaleImage(width, height, _scale, imageData, initialCalc) {
    const { scrollLeft, scrollTop, scale } = this.state;

    // parent height divided by 2
    let w2 = this.el.offsetWidth / 2;
    let h2 = this.el.offsetHeight / 2;

    // image height & width
    let ratio = height / width;
    let w = width * _scale;
    let h = w * ratio;

    let sx = w / width;
    let sy = h / height;

    let dx, dy;
    if (initialCalc) {
      if (imageData.isPortrait) {
        dx = (h / 2) - w2;
        dy = (w / 2) - h2;
      } else {
        dx = (w / 2) - w2;
        dy = (h / 2) - h2;
      }
      return [w, h, dx, dy];
    }

    let c = this.getNativeCenter(scrollLeft, scrollTop, scale);
    dx = (c[0] * sx) - w2;
    dy = (c[1] * sy) - h2;

    return [w, h, dx, dy];
  }

  onImageLoad(imageData, imageMeta) {
    let { width, height } = imageData;

    let minWidth = this.el.offsetWidth / width;
    let minHeight = this.el.offsetHeight / height;
    let minScale = Math.round(Math.max(minWidth, minHeight) * 100) / 100;

    let scale = config.image_initial_scale || 0.5;
    this.__scale = scale;
    let [imageWidth, imageHeight, scrollLeft, scrollTop] = this.scaleImage(width, height, scale, imageData, true);

    // let connected app know the current center
    let pos = this.getNativeCenter(scrollLeft, scrollTop, scale)
    this.props.onImageDragged(pos);

    this.setState({ imageData, scale, imageWidth, imageHeight, minScale, scrollLeft, scrollTop });
  }

  onActionDelete(evt, marker) {
    evt.preventDefault();
    const { highlightControlPoint, onMarkerDelete } = this.props;
    onMarkerDelete(marker.id);
    highlightControlPoint(null);
  }

  onActionLock(evt, marker) {
    evt.preventDefault();
    const { highlightControlPoint, onMarkerLock } = this.props;
    onMarkerLock(marker.id);
    highlightControlPoint(null);
  }

  onVisible(nextProps) {
    const { addAutomaticControlPoint, image, markers, selectedImage } = nextProps;
    const imageMarkers = this.getImageMarkers(markers, selectedImage);

    // If no points for this image, make one up
    if (!imageMarkers || !imageMarkers.length) {
      const x = this.el.offsetWidth / 2;
      const y = this.el.offsetHeight / 2;
      const left = this.el.scrollLeft;
      const top = this.el.scrollTop;

      const [nx, ny] = this.transformPosition(left + x, top + y, true);
      addAutomaticControlPoint([nx, ny], image.name, true);
    }
  }

  onNotVisible() {
    this.props.clearAutomaticControlPoints();
  }

  getImageMarkers(markers, selectedImage) {
    return markers.filter(marker => marker.type === CP_TYPES.IMAGE && marker.img_name === selectedImage);
  }

  renderPoints() {
    const { highlightControlPoint, highlightedControlPoints, joins, markers, selectedImage, selectedMarker } = this.props;

    const imageMarkers = this.getImageMarkers(markers, selectedImage);
    return imageMarkers.map((marker, i) => {
      let [x, y] = this.transformPosition(marker.coord[0], marker.coord[1]);

      let style = {
        left: `${x}px`,
        top: `${y}px`
      };

      let selected = selectedMarker === marker.id ? 1 : 0;
      const highlighted = highlightedControlPoints.indexOf(marker.id) >= 0;

      return (
        <div key={`ip${i}`}
          className={classNames('image-point', {
            active: selected || marker.isAutomatic,
            automatic: marker.isAutomatic,
            joined: joinedPoints(joins, marker.id).length > 1,
            highlighted
          })}
          data-selected={selected}
          data-id={marker.id}
          style={style}
          onMouseOver={() => {
            if (!highlighted) highlightControlPoint(marker.id);
          }}
          onMouseOut={() => {
            if (!this.state.draggingMarker) highlightControlPoint(null);
          }}
        >
          <div className='actions'>
            <ul>
              <li>
                <a className='action' href='#' onClick={(evt) => {this.onActionDelete(evt, marker);}}>Delete</a>
              </li>
              {marker.isAutomatic ? (
                <li>
                  <a className='action' href='#' onClick={(evt) => {this.onActionLock(evt, marker);}}>Deselect</a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      );
    });
  }

  render() {
    const { imageData, imageWidth, imageHeight } = this.state;
    const { image, height } = this.props;

    // Reverse dimensions if image is portrait
    let pointsWidth = imageData.isPortrait ? imageHeight : imageWidth;
    let pointsHeight = imageData.isPortrait ? imageWidth : imageHeight;

    return (
      <div className='imgpanzoom-container'>
        <div
          ref={el => {this.el = el;}}
          className='imagepanzoom'
          onMouseDown={this.onDownHandler}
          onTouchStart={this.onDownHandler}
          onWheel={this.onWheel}
          onDoubleClick={this.onDoubleClick}
          style={{ height: height }}>
          <div className='points-layer' style={{ width: `${pointsWidth}px`, height: `${pointsHeight}px` }}>
            {this.renderPoints()}
          </div>
          <Image
            srcToLoad={image}
            srcToDisplay={imageData.src}
            width={imageWidth}
            height={imageHeight}
            needsRevoking={imageData.needsRevoking}
            orientation={imageData.orientation}
            onImageLoad={this.onImageLoad}
          />
        </div>

      </div>
    );
  }
}

export default ImagePanZoom;
