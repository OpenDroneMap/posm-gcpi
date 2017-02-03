import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import diff from 'deep-diff';

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
    const {markers} = this.state;

    let valid = this.getValidPoints(nextProps.points);
    let preppedMarkers = this.prepMarkersForDiff(markers);
    let preppedPoints = this.prepPointForDiff(valid);

    let d = diff(preppedMarkers, preppedPoints);
    if (typeof d === 'undefined' || !d.length) return;

    let m = [...markers];
    d.forEach((item) => {
      switch(item.kind) {
        case 'A':
          this.renderMarker(nextProps.points[item.index], m);
          break;
      }
    });

    m.forEach(d => {
      d.marker.draggable = this.props.draggable;
    });

    this.setState({markers: m});
  }

  componentDidMount() {
    var valid = this.getValidPoints(this.props.points);

    if (valid) this.renderMarkers(valid);
  }

  componentDidUpdate(prevProps, prevState) {

  }

  prepMarkersForDiff(markers) {
    return markers.map((m) => {
      let latlng = m.marker.getLatLng();
      return {
        id: m.id,
        lat: latlng.lat,
        lng: latlng.lng
      }
    });
  }

  prepPointForDiff(points) {
    return points.map((pt) => {
      return {
        id: pt.id,
        lat: pt.locations.map[0],
        lng: pt.locations.map[1]
      }
    });
  }

  getValidPoints(points) {
    return points.filter((pt) => {
      return pt.locations.map && pt.locations.map.length === 2;
    });
  }

  renderMarker(pt, arr) {
    const {leafletMap} = this.props;
    if (!leafletMap) return;

    let myIcon = L.divIcon({className: 'image-point'});
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

    arr.push({
      marker: m,
      id: pt.id
    });
  }

  renderMarkers(points) {
    return;
    if (!points.length) return;
    points.forEach((pt) => {
      this.renderMarker(pt);
    });
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