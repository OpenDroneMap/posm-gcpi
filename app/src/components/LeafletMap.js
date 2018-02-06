import React, { Component } from 'react';
import L from 'leaflet';
import LeafletSearch from './Leaflet-Search';
import LeafletMapProviders from './LeafletMap-Providers';
import PointMarkersMap from './PointMarkersMap';
import LeafletZoomControls from './Leaflet-ZoomControls.js';
import { CP_MODES } from '../state/utils/controlpoints';

import config from '../config';

class LeafletMap extends Component {

  constructor() {
    super();

    this.onMarkerDragged = this.onMarkerDragged.bind(this);
    this.onMarkerDelete = this.onMarkerDelete.bind(this);
    this.onMarkerMouseOut = this.onMarkerMouseOut.bind(this);
    this.onMarkerMouseOver = this.onMarkerMouseOver.bind(this);
    this.onMarkerToggle = this.onMarkerToggle.bind(this);
    this.onMapClick = this.onMapClick.bind(this);

    this.state = {
      leafletmap: null
    };
  }

  componentWillReceiveProps(np) {
      let currentList = this.props.imagery.gcp_list_name;
      if (np.imagery.gcp_list_name && currentList !== np.imagery.gcp_list_name) {
        this.zoomMapToList(np.controlpoints.points);
      }
  }

  componentDidMount() {
    this.initializeMap();
  }

  zoomMapToList(pts) {
    const { leafletMap } = this.state;
    if (!leafletMap) return;
    let bds = L.latLngBounds();

    pts.filter(p => p.type === 'map').forEach(p => {
      let ll = p.coord;
      if (ll && ll.length === 2) {
        bds.extend(ll);
      }
    });

    if (bds.isValid()) {
      leafletMap.fitBounds(bds);
    }
  }

  initializeMap() {
    const { leafletMap } = this.state;
    const { onMapPositionChange } = this.props;
    if (leafletMap) return;

    let mapContainer = this.refs.lmap;
    let map = L.map(mapContainer, config.map_options)
                  .setView(config.map_options.initialCenter, config.map_options.initialZoom);


    map.on('moveend', (evt) => {
      onMapPositionChange(map.getCenter());
    });

    map.on('click', this.onMapClick);

    // let others know center
    // method from Wrapped.js
    onMapPositionChange(map.getCenter());

    this.setState({
      leafletMap: map
    });
  }

  onMapClick(evt) {
    const { controlpoints, addControlPoint } = this.props;
    if (controlpoints.mode === CP_MODES.ADDING) {
      let ll = evt.latlng;
      addControlPoint([ll.lat, ll.lng]);
    }
  }

  onMarkerDragged(marker_id, pos) {
    const { setControlPointPosition } = this.props;
    setControlPointPosition('map', marker_id, pos);
  }

  onMarkerDelete(marker_id) {
    const { deleteControlPoint } = this.props;
    deleteControlPoint(marker_id);
  }

  onMarkerMouseOut() {
    this.props.highlightControlPoint(null);
  }

  onMarkerMouseOver(marker_id) {
    if (this.props.controlpoints.highlighted.indexOf(marker_id) < 0) {
      this.props.highlightControlPoint(marker_id);
    }
  }

  onMarkerToggle(marker_id, marker_img, latlng) {
    const { toggleControlPointMode, controlpoints, setPointProperties, joinControlPoint } = this.props;

    if (controlpoints.mode === CP_MODES.ADDING) {
      return setPointProperties(false, null, null, null, marker_id, [latlng.lat, latlng.lng]);

    } else if (controlpoints.mode === CP_MODES.IMAGE_EDIT) {
      console.log('JOIN HERE: ', marker_id);
      return joinControlPoint(marker_id);
    }

    toggleControlPointMode(marker_id);
  }

  render() {
    const { leafletMap } = this.state;
    const { controlpoints, imagery } = this.props;

    return (
      <div className='leaflet-map-wrapper'>
        <div className='leaflet-map' ref='lmap' />
        <LeafletSearch leafletMap={leafletMap} />
        <LeafletMapProviders leafletMap={leafletMap} />
        <LeafletZoomControls leafletMap={leafletMap} controlpoints={controlpoints} />
        <PointMarkersMap
          highlightedControlPoints={controlpoints.highlighted}
          leafletMap={leafletMap}
          selectedMarker={controlpoints.selected}
          selectedImage={imagery.selected}
          joins={controlpoints.joins}
          points={controlpoints.points}
          mode={controlpoints.mode}
          onMarkerDragged={this.onMarkerDragged}
          onMarkerDelete={this.onMarkerDelete}
          onMarkerMouseOut={this.onMarkerMouseOut}
          onMarkerMouseOver={this.onMarkerMouseOver}
          onMarkerToggle={this.onMarkerToggle}
        />
      </div>
    );
  }
}

export default LeafletMap;
