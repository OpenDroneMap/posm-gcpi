import React, { Component, PropTypes } from 'react';
import Image from './Image';
import Slider from 'react-rangeslider';

// https://github.com/rexxars/react-element-pan/blob/master/src/element-pan.js
class ImagePanZoom extends Component {

  static propTypes = {
    image: PropTypes.object,
    points: PropTypes.array,
    onImagePositionChange: PropTypes.func,
    markerDraggable: PropTypes.bool,
    selectedMarker: PropTypes.number
  }

  static defaultProps = {
    image: null,
    points: [],
    onImagePositionChange: () => {},
    markerDraggable: false
  }

  constructor(props) {
    super(props);

    this.state = {
      dragging: false,
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
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.image !== nextProps.image) {
      this.reset();
    }

    this.setState({ dragging: false, marker: null });
  }

  componentDidMount() {}

  componentDidUpdate() {
    const { scrollLeft, scrollTop } = this.state;

    if (this.el) {
      this.el.scrollLeft = scrollLeft;
      this.el.scrollTop = scrollTop;
    }
  }

  reset() {
    if (this.el) {
      this.el.scrollLeft = 0;
      this.el.scrollTop = 0
    }

    this.setState({
      dragging: false
    });
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

  onDownHandler(evt) {
    evt.preventDefault();
    if (!evt.target) return;

    window.addEventListener('mousemove', this.onDragMove);
    window.addEventListener('touchmove', this.onDragMove);
    window.addEventListener('mouseup', this.onDragStop);
    window.addEventListener('touchend', this.onDragStop);

    // let target = evt.currentTarget || evt.target;
    let bounds = evt.target.getBoundingClientRect();

    let [startX, startY] = this.getMousePosition(evt);

    this._marker = evt.target.className.indexOf('image-point') > -1 ? evt.target : null;

    var state = {
      dragging: true,
      marker: this._marker  ? true : false,

      elHeight: this.el.clientHeight,
      elWidth: this.el.clientWidth,

      startX: startX,
      startY: startY,

      scrollX: this.el.scrollLeft,
      scrollY: this.el.scrollTop,

      maxX: bounds.width,
      maxY: bounds.height
    };

    this.setState(state);
  }

  onDragMove(evt) {
    if (!this.state.dragging) {
      return;
    }

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

  onDragStop(evt) {
    let [x, y] = this.getMousePosition(evt);

    let left = this.el.scrollLeft;
    let top = this.el.scrollTop;

    let [nx, ny] = this.transformPosition(left + x, top + y, true);

    if (this._marker) {
      this._marker.style.left = `${nx}px`;
      this._marker.style.top = `${ny}px`;
    }

    window.removeEventListener('mousemove', this.onDragMove);
    window.removeEventListener('touchmove', this.onDragMove);
    window.removeEventListener('mouseup', this.onDragStop);
    window.removeEventListener('touchend', this.onDragStop);

    let markerId = this._marker ? +this._marker.dataset.id : null;

    // let others know of image center change, via callback
    this.props.onImagePositionChange([nx, ny], markerId);

    this._marker = null;

    this.setState({ dragging: false, marker: false, scrollLeft: left, scrollTop: top });
  }

  onSliderChange(value) {
    const { imageData } = this.state;
    if (!imageData.src) return;

    let scale = value;
    let [imageWidth, imageHeight, scrollLeft, scrollTop] = this.scaleImage(imageData.width, imageData.height, scale);
    this.setState({scale, imageWidth, imageHeight, scrollLeft, scrollTop});
  }

  getNativeCenter(left, top, scale) {
    let x = (left + 122) * (1/scale);
    let y = (top + 80) * (1/scale);
    return [x, y];
  }

  scaleImage(width, height, _scale, imageData, initialCalc) {
    const { scrollLeft, scrollTop, scale } = this.state;
    let ratio = height / width;
    let w = width * _scale;
    let h = w * ratio;


    let sx = w / width;
    let sy = h / height;

    let dx, dy;
    if (initialCalc) {
      if (imageData.isPortrait) {
        dx = (h / 2) - 122;
        dy = (w / 2) - 80;
      } else {
        dx = (w / 2) - 122;
        dy = (h / 2) - 80;
      }
      return [w, h, dx, dy];
    }


    let c = this.getNativeCenter(scrollLeft, scrollTop, scale);
    dx = (c[0] * sx) - 122;
    dy = (c[1] * sy) - 80;


    return [w, h, dx, dy];
  }

  onImageLoad(imageData, imageMeta) {
    let { width, height } = imageData;

    // 244 & 160 come from css width / height for .imagepanzoom
    let minWidth = 244 / width;
    let minHeight = 160 / height;
    let minScale = Math.round(Math.max(minWidth, minHeight) * 10) / 10;

    let scale = 0.5;
    this.__scale = scale;
    let [imageWidth, imageHeight, scrollLeft, scrollTop] = this.scaleImage(width, height, scale, imageData, true);

    // let connected app know the current center
    let pos = this.getNativeCenter(scrollLeft, scrollTop, scale)
    this.props.onImagePositionChange(pos);

    this.setState({imageData, scale, imageWidth, imageHeight, minScale, scrollLeft, scrollTop});
  }


  renderPoints() {
    const { points, selectedImage, markerDraggable, selectedMarker } = this.props;

    return points.map((pt, i) => {
      if (pt.imageIndex === selectedImage && pt.locations.image) {
        let [x, y] = this.transformPosition(pt.locations.image[0], pt.locations.image[1]);

        let style = {
          left: `${x}px`,
          top: `${y}px`
        };

        let klass = markerDraggable && selectedMarker === pt.id ? ' draggable' : '';
        return <div key={`ip${i}`} className={`image-point${klass}`} data-id={pt.id} style={style} />;
      }

      return null;
    });
  }

  render() {
    const { imageData, scale, imageWidth, imageHeight, minScale } = this.state;
    const { image } = this.props;


    // due to image orientation, we need to reverse dimensions
    // if image is a portrait
    let pointsWidth = imageData.isPortrait ? imageHeight : imageWidth;
    let pointsHeight = imageData.isPortrait ? imageWidth : imageHeight;

    return (
      <div className='imgpanzoom-container'>
        <div
          ref={(el) => {this.el = el;}}
          className='imagepanzoom'
          onMouseDown={this.onDownHandler}
          onTouchStart={this.onDownHandler}>
          <div className='points-layer' style={{width: `${pointsWidth}px`, height: `${pointsHeight}px`}}>
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
        <Slider
          value={scale}
          min={minScale}
          max={2}
          step={0.01}
          orientation="vertical"
          onChange={this.onSliderChange}
        />
      </div>
    );
  }
}

export default ImagePanZoom;