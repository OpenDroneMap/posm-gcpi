import React, { Component } from 'react';
import L from 'leaflet';
import LeafletMapProviders from './LeafletMap-Providers';
import ImagesGetter from '../connectors/ImagesGetter';
import Images from '../connectors/Images';
import Points from './Points';
import PointMarkersMap from './PointMarkersMap';

const MAP_OPTIONS = {
  minZoom: 5,
  scrollWheelZoom: false
};

class LeafletMap extends Component {

  constructor() {
    super();
    this.state = {
      leafletmap: null
    };

    this.onMapMouseUp = this.onMapMouseUp.bind(this);
  }

  getPointsForFile(idx) {
    const {controlpoints} = this.props;
    let pts = [];

    if (typeof controlpoints.points === 'undefined' || !controlpoints.points) return pts;

    controlpoints.points.forEach(function(point, i){
      if (point.imageIndex === idx) {

        pts.push({
          location: controlpoints.location,
          active: (controlpoints.active && i === controlpoints.pointIndex),
          imageIndex: point.imageIndex,
          pointIndex: i
        });
      }
    });

    return pts;
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentWillReceiveProps(nextProps) {
    /*
    console.log('addControlPoint: ', this.props.addControlPoint === nextProps.addControlPoint);
    console.log('imagery: ', this.props.imagery === nextProps.imagery);
    console.log('controlpoints: ', this.props.controlpoints === nextProps.controlpoints);
    console.log('toggleControlPointMode: ', this.props.toggleControlPointMode === nextProps.toggleControlPointMode);
    console.log('updateControlPoint: ', this.props.updateControlPoint === nextProps.updateControlPoint);
    */
  }

  initializeMap() {
    const {leafletMap} = this.state;
    if (leafletMap) return;

    let mapContainer = this.refs.lmap;
    let map = L.map(mapContainer, MAP_OPTIONS)
                  .setView([51.505, -0.09], 13);

    map.on('mouseup', this.onMapMouseUp, this);
    this.setState({
      leafletMap: map
    });
  }

  onMapMouseUp(evt) {
    const {controlpoints, updateControlPoint} = this.props;
    if (!controlpoints.active || (controlpoints.location !== 'map')) return;
    updateControlPoint([evt.latlng.lat, evt.latlng.lng]);
  }


  render() {
    const {leafletMap} = this.state;
    const {imagery, controlpoints} = this.props;

    return (
      <section className='inner'>
        {imagery.items &&
          <Points addControlPoint={this.props.addControlPoint} toggleControlPointMode={this.props.toggleControlPointMode} fileIndex={imagery.selected} points={this.getPointsForFile(imagery.selected)}/>
        }
        <div className='panel panel-images'>
          <ImagesGetter />
          <div className='images-container'>
            <Images leafletMap={leafletMap} />
          </div>
        </div>
        <div className='panel panel-map'>
          <div className='leaflet-map-wrapper'>
            <div className='leaflet-map' ref='lmap' />
            <LeafletMapProviders leafletMap={leafletMap} />
            <PointMarkersMap leafletMap={leafletMap} selectedImage={imagery.selected} points={controlpoints.points} />
          </div>
        </div>
      </section>
    );
  }
}

export default LeafletMap;
