import React, { Component, PropTypes } from 'react';
import L from 'leaflet';

/*
  TODO: Map providers should come from a config
 */

L.TileLayer.Bing = L.TileLayer.extend({
 getTileUrl: function (tilePoint) {
    return L.Util.template(this._url, {
      s: Math.floor( Math.random() * 3 ),
      q: this._quadKey(tilePoint.x, tilePoint.y, this._getZoomForUrl())
    });
 },
 _quadKey: function (x, y, z) {
   let quadKey = [];
   for (let i = z; i > 0; i--) {
    let digit = '0';
    let mask = 1 << (i - 1);
    if ((x & mask) !== 0) {
      digit++;
    }
    if ((y & mask) !== 0) {
      digit++;
      digit++;
    }

    quadKey.push(digit);
   }

   return quadKey.join('');
 }
 });

L.tileLayer.bing = function(url, options) {
    return new L.TileLayer.Bing(url, options);
}

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
      selected: 'osm',
      custom: null,
      init: false
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onCustomClick = this.onCustomClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {init} = this.state;

    if (nextProps.leafletMap && !init) {
      this.setProvider(nextProps.leafletMap, this.state.selected);
      this.setState({init: true});
    }
  }

  componentDidMount() {
    this.setProvider(this.props.leafletMap, this.state.selected);
  }

  onChangeHandler(evt) {
    const {selected, custom} = this.state;

    if (selected !== evt.target.value) {
      this.setProvider(this.props.leafletMap, evt.target.value, custom);
      this.setState({
        selected: evt.target.value
      });
    }
  }

  onCustomClick(evt) {
    const {custom} = this.state;
    const {leafletMap} = this.props;

    // http://a.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg
    var parent = evt.target.parentNode;
    var provider = parent.querySelector('input').value.trim();

    // TODO: validate provider template ?
    if (custom !== provider) {
      this.setProvider(leafletMap, 'custom', provider);

      this.setState({
        custom: provider
      });
    }

  }

  setProvider(map, provider, custom = null) {
    if (!map) return;

    if (provider === 'satellite') {
      L.tileLayer.bing('https://ecn.t{s}.tiles.virtualearth.net/tiles/a{q}.jpeg?g=587&mkt=en-gb&n=z', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors</a>',
          maxZoom: 19
      }).addTo(map);
    } else if (provider === 'osm') {
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors</a>',
          maxZoom: 19
      }).addTo(map);
    } else if (provider === 'custom' && custom) {
      L.tileLayer(custom, {
          attribution: '',
          maxZoom: 19
      }).addTo(map);
    }

  }

  render() {
    const {leafletMap} = this.props;
    if (!leafletMap) return null;

    const {selected} = this.state;

    return (
      <div className='leaflet-map-providers'>
        <h4>Map Providers</h4>
        <ul className='list-reset'>
          <li>
            <label>
              <input className='input' type='radio' value='osm' checked={selected === 'osm'} onChange={this.onChangeHandler}/>
              <span>OpenStreetMap</span>
            </label>
          </li>

          <li>
            <label>
              <input className='input' type='radio' value='satellite' checked={selected === 'satellite'} onChange={this.onChangeHandler}/>
              <span>Satellite</span>
            </label>
          </li>

          <li>
            <label>
              <input className='input custom-provider' type='radio' value='custom' checked={selected === 'custom'} onChange={this.onChangeHandler}/>
              <span>Custom</span>
              <div>
                <input className='input' type='text' placeholder='Enter template URL...'/>
                <button className='btn btn-outline teal' onClick={this.onCustomClick}>Update</button>
              </div>
            </label>
          </li>
        </ul>
      </div>
    );
  }
}

export default LeafletMapProviders;