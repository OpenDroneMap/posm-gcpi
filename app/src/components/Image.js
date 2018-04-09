import React, { Component, PropTypes } from 'react';
import ImageLoader from 'blueimp-load-image';

class Image extends Component {

  static propTypes = {
    srcToLoad: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    srcToDisplay: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    scale: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    orientation: PropTypes.number,
    onImageLoad: PropTypes.func,
    needsRevoking: PropTypes.bool
  }

  static defaultProps = {
    srcToLoad: null,
    srcToDisplay: null,
    scale: 1,
    width: 0,
    height: 0,
    orientation: 1,
    needsRevoking: false,
    onImageLoad: () => {}
  }

  constructor(props) {
    super(props);
    this.onInternalImageLoad = this.onInternalImageLoad.bind(this);
  }

  loadImage(src) {
    if (!src) return;
    const { onImageLoad } = this.props;
    const needsRevoking = (ImageLoader.isInstanceOf('Blob', src) || ImageLoader.isInstanceOf('File', src));
    ImageLoader(
        src,
        function (img, meta) {

          if (typeof onImageLoad === 'function') {
            let orientation = (meta.exif) ? meta.exif.get('Orientation') : 1;
            let width = img.width;
            let height = img.height;

            let isPortrait = (orientation === 8 || orientation === 6) ? true : false;
            onImageLoad({
              src: img.src,
              width,
              height,
              isPortrait,
              orientation,
              needsRevoking
            }, meta);
          }

        },
        { meta: true, noRevoke:true } // Options
    );
  }

  shouldComponentUpdate(nextProps) {
    return (this.props !== nextProps) ? true : false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.srcToLoad !== nextProps.srcToLoad) this.loadImage(nextProps.srcToLoad);
  }

  componentDidMount() {
    this.loadImage(this.props.srcToLoad);
  }

  onInternalImageLoad(evt) {
    if (evt.target.src.indexOf('blob:') === 0 || this.props.needsRevoking) ImageLoader.revokeObjectURL(evt.target.src);
  }

  render() {
    const { srcToDisplay, width, height, orientation } = this.props;
    if (!srcToDisplay) return null;

    return (
      <img src={srcToDisplay} className={`image-panzoom orientation${orientation}`} width={width} height={height} style={{ width: width + 'px', height: height +'px' }} alt='selected' onLoad={this.onInternalImageLoad}/>
    );
  }
}

export default Image;
