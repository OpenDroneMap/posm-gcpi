import React, { Component, PropTypes } from 'react';
import L from 'leaflet';

const ICON = {
  className: 'image-point',
  iconSize: [38,38]
};

class PointMarkersMap extends Component {
  static propTypes = {
    leafletMap: PropTypes.object,
    updatePosition: PropTypes.func.isRequired,
    points: PropTypes.array.isRequired,
    selectedImage: PropTypes.number,
    draggable: PropTypes.bool
  }

  static defaultProps = {
    leafletMap: null,
    selectedImage: 0,
    draggable: false
  }

  constructor(props) {
    super(props);

    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.state = {markers: []};
  }

  // adding markers here so we can
  // update state w/o re-rendering
  componentWillReceiveProps(nextProps) {
    let {markers} = this.state;
    const {draggable} = nextProps;

    let points = this.getValidPoints(nextProps.points);

    // if same then go
    if (points.length === markers.length) return;

    // if markers > points, delete
    if (markers.length > points.length) {
      markers = this.deleteMarkers(markers, points);
    }

    // if markers < points, add
    if (points.length > markers.length) {
      markers = this.addMarkers(markers, points);
    }

    this.setState({markers});
  }

  componentDidUpdate() {
    const {draggable} = this.props;

    this.state.markers.forEach(m => {
      if (draggable) {
        m.marker.dragging.enable();
      } else {
        m.marker.dragging.disable();
      }
    });
  }

  componentDidMount() {}

  getValidPoints(points) {
    return points.filter((pt) => {
      return pt.locations.map && pt.locations.map.length === 2;
    });
  }

  createHash(arr, key='id') {
    let h = {};
    arr.forEach((m, i) => {
      h[m.id] = i;
    });

    return h;
  }

  deleteMarkers(markers, points) {
    const {leafletMap} = this.props;
    if (!leafletMap) return;

    const hash = this.createHash(points);

    return markers.filter(m => {
      let r = hash.hasOwnProperty(m.id);

      if (!r) {
        leafletMap.removeLayer(m.marker);
        m.marker = null;
      }

      return r;
    });
  }

  addMarkers(markers, points) {
    const {leafletMap} = this.props;
    if (!leafletMap) return;

    const hash = this.createHash(markers);

    points.forEach(pt => {
      let r = hash.hasOwnProperty(pt.id);
      if (!r) {
        markers.push(this.renderMarker(pt));
      }
    });

    return markers;
  }

  renderMarker(pt) {
    const {leafletMap} = this.props;
    if (!leafletMap) return;

    let myIcon = L.divIcon(ICON);
    let lat = pt.locations.map[0];
    let lng = pt.locations.map[1];
    let m = L.marker([lat, lng], {
      icon: myIcon,
      draggable: true
    });

    m.addTo(leafletMap);
    let me = this;
    m.on('dragend', function(evt) {
      me.onMarkerDragEnd(this);
    });

    m._pointid = pt.id;

    return {
      marker: m,
      id: pt.id
    };
  }

  onMarkerDragEnd(marker) {
    let pos = marker.getLatLng();
    this.props.updatePosition('map', marker._pointid, [pos.lat, pos.lng]);
  }

  render() {
    const {leafletMap} = this.props;
    if (!leafletMap) return null;

    return (
      <div/>
    );
  }
}

export default PointMarkersMap;