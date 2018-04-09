import { Component } from 'react';

import L from 'leaflet';
import 'leaflet-control-geocoder';

class LeafletSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.initialized) return;
    if (nextProps.leafletMap) {
      this.initializeSearch(nextProps.leafletMap);
    }
  }

  initializeSearch(map) {
    let options = {
      defaultMarkGeocode: false
    };

    L.Control.geocoder(options)
      .on('markgeocode', function(e) {
        var bbox = e.geocode.bbox;
        var poly = L.polygon([
          bbox.getSouthEast(),
          bbox.getNorthEast(),
          bbox.getNorthWest(),
          bbox.getSouthWest()
        ]);
        map.fitBounds(poly.getBounds());
      })
      .addTo(map);

    this.setState({
      initialized: true
    });
  }

  onSelect(evt) {
    evt.preventDefault();
  }

  render() {
    return null;
  }
}

export default LeafletSearch;
