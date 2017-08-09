import React, { Component, PropTypes } from 'react';
import ImageLoader from 'blueimp-load-image';

class ImagesGridThumb extends Component {
  static propTypes = {
    src: PropTypes.object,
    onThumbClick: PropTypes.func,
    onDeleteImage: PropTypes.func,
    selected: PropTypes.bool,
    points: PropTypes.number
  }

  static defaultProps = {
    src: null,
    onThumbClick: () => {},
    onDeleteImage: () => {},
    selected: false,
    points: 0
  }

  loadImage(src) {
    if (!src) return;
    let imgElm = this.thumbImage;

    // TODO: width & height need to be settable
    let options = {
      canvas: true,
      maxWidth: 150,
      maxHeight: 150,
      contain: true,
      pixelRatio: window.devicePixelRatio,
      orientation: true
    };

    ImageLoader(
      src,
      function (canvas) {
        imgElm.style.backgroundImage = `url(${canvas.toDataURL('image/jpeg', 0.5)})`;
      },
      options // Options
    );
  }

  /* Lifecycles */
  shouldComponentUpdate(nextProps) {
    return (this.props !== nextProps) ? true : false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src) this.loadImage(nextProps.src);
  }

  componentDidMount() {
    this.loadImage(this.props.src);
  }

  onClickHandler(evt) {
    const {onThumbClick, src} = this.props;
    evt.preventDefault();
    onThumbClick(src);
  }

  onDeleteHandler(evt) {
    const {onDeleteImage, filename} = this.props;
    evt.preventDefault();
    evt.stopPropagation();
    onDeleteImage(filename);
  }

  getThumbClass() {
    const {selected, src} = this.props;
    let klass = 'thumb';

    if (!src) klass += ' no-img';
    if (!selected) return klass;

    return klass += ' selected';
  }

  render() {
    const {points, filename} = this.props;

    return (
      <div className={this.getThumbClass()} onClick={(evt) => {this.onClickHandler(evt);}}>
        <div className='badge bubble'>
          <span className='count'>{points}</span>
        </div>
        <div className='delete bubble' onClick={(evt) => {this.onDeleteHandler(evt);}}>
          <span>&times;</span>
        </div>
        <div className='img' ref={el => {this.thumbImage = el;}} />
        <p className='img-name'>{filename}</p>
      </div>
    );
  }
}

export default ImagesGridThumb;