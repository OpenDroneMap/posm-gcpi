import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import diff from 'deep-diff';

class PointMarkersMap extends Component {
  static propTypes = {
    leafletMap: PropTypes.object
  }

  static defaultProps = {
    leafletMap: null
  }

  constructor(props) {
    super(props);

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

    d.forEach((item) => {
      switch(item.kind) {
        case 'A':
          this.renderMarker(nextProps.points[item.index]);
          break;
      }
    });
  }

  componentDidMount() {
    var valid = this.getValidPoints(this.props.points);

    if (valid) this.renderMarkers(valid);
  }

  prepMarkersForDiff(markers) {
    return markers.map((m) => {
      console.log(m);
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

  renderMarker(pt) {
    const {leafletMap} = this.props;
    const {markers} = this.state;

    if (!leafletMap) return;

    let myIcon = L.divIcon({className: 'image-point'});
    let lat = pt.locations.map[0];
    let lng = pt.locations.map[1];
    let m = L.marker([lat, lng], {icon: myIcon});

    m.addTo(leafletMap);

    markers.push({
      marker: m,
      id: pt.id
    });
  }

  renderMarkers(points) {
    if (!points.length) return;
    points.forEach((pt) => {
      this.renderMarker(pt);
    });
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