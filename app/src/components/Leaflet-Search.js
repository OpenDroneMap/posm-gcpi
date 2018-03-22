import { Component } from 'react';

import L from 'leaflet';
import 'leaflet-control-geocoder';

class LeafletSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false
    };

  }

  componentWillReceiveProps(np) {
    if (this.state.init) return;
    if (np.leafletMap) {
      this.initializeSearch(np.leafletMap);
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
      init: true
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
