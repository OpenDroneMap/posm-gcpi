import { Component, PropTypes } from 'react';
import L from 'leaflet';
import './LeafletMap-Providers-Control';
import config from '../config';

class LeafletMapProviders extends Component {
  static propTypes = {
    leafletMap: PropTypes.object
  }

  static defaultProps = {
    leafletMap: null
  }

  constructor(props) {
    super(props);
    this.state = {
      initialized: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.initialized) return;

    if (nextProps.leafletMap) {
      this.initialize(nextProps.leafletMap);
    }
  }

  initialize(map) {
    L.control.mapProviders({
      providers: config.map_providers,
      selected: 'osm',
      custom_desc: config.custom_description,
      initial_open: false
    }).addTo(map);

    this.setState({
      initialized: true
    });
  }

  render() {
    return null;
  }
}

export default LeafletMapProviders;
