import React, { Component } from 'react';
import L from 'leaflet';
import LeafletMapProviders from './LeafletMap-Providers';
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

  initializeMap() {
    const {leafletMap} = this.state;
    const {onMapPositionChange} = this.props;
    if (leafletMap) return;

    let mapContainer = this.refs.lmap;
    let map = L.map(mapContainer, MAP_OPTIONS)
                  .setView([51.505, -0.09], 13);

    map.on('moveend', (evt) => {
      onMapPositionChange(map.getCenter());
    });

    // let others know center
    // method from Wrapped.js
    onMapPositionChange(map.getCenter());

    this.setState({
      leafletMap: map
    });
  }

  render() {
    const {leafletMap} = this.state;
    const {controlpoints, setControlPointPosition} = this.props;

    return (
      <div className='leaflet-map-wrapper'>
        <div className='leaflet-map' ref='lmap' />
        <LeafletMapProviders leafletMap={leafletMap} />
        <PointMarkersMap
          leafletMap={leafletMap}
          selectedMarker={controlpoints.pointId}
          draggable={controlpoints.active}
          points={controlpoints.points}
          updatePosition={setControlPointPosition} />
      </div>
    );
  }
}

export default LeafletMap;
