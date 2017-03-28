import { Component } from 'react';

import L from 'leaflet';
import 'leaflet-geocoder-mapzen';

const API_KEY = 'mapzen-zFfeyp3';

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
      position: 'topright',
      expanded: true,
      attribution: null,
      panToPoint: false,
      pointIcon: false,
      polygonIcon: false,
      markers: false,
      fullWidth: false
    };

    L.control.geocoder(API_KEY, options).addTo(map);

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