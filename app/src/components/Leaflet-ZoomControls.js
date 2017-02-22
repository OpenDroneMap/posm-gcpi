import React, { Component, PropTypes } from 'react';
import L from 'leaflet';


class LeafletZoomControls extends Component {

  static propTypes = {
    leafletMap: PropTypes.object,
    controlpoints: PropTypes.object
  }

  static defaultProps = {
    leafletMap: null
  }

  constructor(props) {
    super(props);

    this._init = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.leafletMap && !this._init) {
      this._init = true;
    }
  }

  componentDidMount() {}

  onZoomIn() {
    const {leafletMap} = this.props;

    let max = leafletMap.getMaxZoom();
    let z = leafletMap.getZoom();
    if (z < max) leafletMap.setZoom(z + 1);
  }

  onZoomOut() {
    const {leafletMap} = this.props;

    let min = leafletMap.getMinZoom();
    let z = leafletMap.getZoom();
    if (z > min) leafletMap.setZoom(z - 1);
  }

  onFitMarkers() {
    const {controlpoints} = this.props;
    const {leafletMap} = this.props;
    if (!controlpoints.points.length) return;

    let bds = L.latLngBounds();

    controlpoints.points.forEach(pt => {
      bds.extend(pt.locations.map);
    });

    if (!bds.isValid()) return;

    leafletMap.fitBounds(bds);
  }


  render() {
    const {leafletMap} = this.props;
    if (!leafletMap) return null;

    return (
      <div className='leaflet-zoom-controls'>
        <div className='leaflet-control-zoom leaflet-bar leaflet-control'>
          <a className='leaflet-control-zoom-in' href='#' title='Zoom in' onClick={()=>{this.onZoomIn();}} >+</a>
          <a className='leaflet-control-zoom-out' href='#' title='Zoom out' onClick={()=>{this.onZoomOut();}} >-</a>
          <a className='leaflet-control-fit-bounds' href='#' title='Fit markers' onClick={()=>{this.onFitMarkers();}} ><span className='icon fit-marker'/></a>
        </div>
      </div>
    );
  }
}

export default LeafletZoomControls;