import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import { CP_TYPES, joinedPoints } from '../state/utils/controlpoints';

const ICON = {
  className: 'image-point',
  iconSize: [38, 38]
};

const HIGHLIGHTED_ICON = {
  className: 'image-point image-point-highlighted',
  iconSize: [55, 55]
};

const Z_INDEXES = {
  ACTIVE: 5000,
  HIGHLIGHTED: 7500,
  EDITABLE: 10000
};

const GCPMarker = L.Marker.extend({
  initialize: function (latlng, options) {
    // add the default actions click handler to options
    L.Util.setOptions(this, {
      onActionsClick: (evt) => {}
    });

    L.Marker.prototype.initialize.call(this, latlng, options);
  },

  _initIcon: function () {
    L.Marker.prototype._initIcon.call(this);

    this._actionsEl = this._icon.querySelector('.actions');

    L.DomEvent.on(this._actionsEl, 'click', this.options.onActionsClick);
  },

  _removeIcon: function () {
    if (this._actionsEl) {
      L.DomEvent.off(this._actionsEl, 'click', this.options.onActionsClick);
    };

    this._actionsEl = null;

    L.Marker.prototype._removeIcon.call(this);
  },

  addClass: function(k) {
    if (!this._icon) return;
    if (L.DomUtil.hasClass(this._icon, k)) return;
    L.DomUtil.addClass(this._icon, k);
  },

  removeClass: function(k) {
    if (!this._icon) return;
    if (!L.DomUtil.hasClass(this._icon, k)) return;
    L.DomUtil.removeClass(this._icon, k);
  }
});

const GCPIcon = L.DivIcon.extend({
  initialize: function (options, label) {
    L.DivIcon.prototype.initialize.call(this, options);
    this.label = label;
  },

  createIcon: function (oldIcon) {
    let div = L.DivIcon.prototype.createIcon.call(this, oldIcon);

    let actions = L.DomUtil.create('div', 'actions', div);
    let ul = L.DomUtil.create('ul', '', actions);
    ['Delete', 'Lock'].forEach(d => {
      let li = L.DomUtil.create('li', d.toLowerCase(), ul);
      let a = L.DomUtil.create('a', '', li);
      a.setAttribute('data-action', d.toLowerCase());
      a.innerHTML = d;
      a.href = '#';
    });

    if (this.label) {
      let labelElement = L.DomUtil.create('div', 'image-point-label', div);
      labelElement.innerHTML = this.label;
    }

    return div;
  }
});

class PointMarkersMap extends Component {
  static propTypes = {
    highlightedControlPoints: PropTypes.array,
    leafletMap: PropTypes.object,
    points: PropTypes.array,
    selectedMarker: PropTypes.any,
    selectedImage: PropTypes.any,
    onMarkerDragged: PropTypes.func,
    onMarkerDelete: PropTypes.func,
    onMarkerLock: PropTypes.func,
    onMarkerMouseOut: PropTypes.func,
    onMarkerMouseOver: PropTypes.func,
    onMarkerToggle: PropTypes.func
  }

  static defaultProps = {
    highlightedControlPoints: [],
    leafletMap: null,
    points: [],
    selectedMarker: null,
    selectedImage: null,
    onMarkerDragged: () => {},
    onMarkerDelete: () => {},
    onMarkerLock: () => {},
    onMarkerMouseOut: () => {},
    onMarkerMouseOver: () => {},
    onMarkerToggle: () => {}
  }

  constructor(props) {
    super(props);

    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);

    this.state = {
      dragging: false,
      markers: []
    };
  }

  // Determine if an update is needed
  dirty(np) {
    const { highlightedControlPoints, points, selectedMarker, selectedImage } = this.props;

    return (
      (np.highlightedControlPoints !== highlightedControlPoints) ||
      (np.points !== points) ||
      (np.selectedMarker !== selectedMarker) ||
      (np.selectedImage !== selectedImage)
    );
  }

  componentWillReceiveProps(np) {
    // set dirty flag
    this._dirty = this.dirty(np);

    if (!this._dirty) return;

    let { markers } = this.state;

    let points = this.getValidPoints(np.points);

    if (markers.length > points.length) { // if markers > points, delete
      markers = this.deleteMarkers(markers, points);
    }
    else if (points.length > markers.length) { // if markers < points, add
      markers = this.addMarkers(markers, points);
    }

    this.setState({ markers: this.updateMarkersAttributes(markers, points) });
  }

  // dirty flag set in componentWillReceiveProps
  shouldComponentUpdate(np, ns) {
    return this._dirty;
  }

  componentDidUpdate() {
    const { highlightedControlPoints, joins, selectedMarker } = this.props;
    const { markers } = this.state;

    markers.forEach((m,i) => {
      m.marker.setIcon(new GCPIcon(ICON));

      if (highlightedControlPoints.indexOf(m.id) >= 0) {
        m.marker.setIcon(new GCPIcon(HIGHLIGHTED_ICON, m.label));
        m.marker.setZIndexOffset(Z_INDEXES.HIGHLIGHTED);
      }

      if (m.id === selectedMarker) {
        m.marker.addClass('active');
        m.marker.setZIndexOffset(Z_INDEXES.EDITABLE);
      }
      else {
        m.marker.removeClass('active');

        if (this.shouldHighlightMarker(m.id)){
          m.marker.setZIndexOffset(Z_INDEXES.ACTIVE);
        }
        else {
          m.marker.setZIndexOffset(0);
        }
      }

      if (joinedPoints(joins, m.id).length > 1) {
        m.marker.addClass('joined');
      }
      else {
        m.marker.removeClass('joined');
      }

      if (m.isAutomatic) {
        m.marker.addClass('automatic');
      }
      else {
        m.marker.removeClass('automatic');
      }
    });
  }

  getValidPoints(points) {
    return points.filter((pt) => {
      return pt.type === CP_TYPES.MAP;
    });
  }

  shouldHighlightMarker(marker_id) {
    const { joins, selectedImage } = this.props;

    if (!joins.hasOwnProperty(marker_id)) return false;

    let match = joins[marker_id].find(img_name => {
      return img_name.indexOf(selectedImage) > -1;
    });

    return match ? true : false;
  }

  createLookup(arr, key='id') {
    let h = {};
    arr.forEach((m, i) => {
      h[m[key]] = i;
    });

    return h;
  }

  updateMarkersAttributes(markers, points) {
    const hash = this.createLookup(points);

    markers.forEach(m => {
      let r = hash.hasOwnProperty(m.id);
      if (r) {
        let pt = points[hash[m.id]];
        m.hasImage = pt.hasImage;
        m.isAutomatic = pt.isAutomatic;
      }
    });

    return markers;
  }

  deleteMarkers(markers, points) {
    const { leafletMap } = this.props;
    if (!leafletMap) return;

    const hash = this.createLookup(points);

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
    const { leafletMap } = this.props;
    if (!leafletMap) return;

    const hash = this.createLookup(markers);

    points.forEach(pt => {
      let r = hash.hasOwnProperty(pt.id);
      if (!r) {
        markers.push(this.renderMarker(pt));
      }
    });

    return markers;
  }


  onActionsClick(evt, id) {
    L.DomEvent.stop(evt);
    let action = evt.target.dataset.action;
    if (!action) return;

    const { onMarkerDelete, onMarkerLock, onMarkerMouseOut, onMarkerToggle } = this.props;

    if (action === 'delete') {
      onMarkerDelete(id);
    }
    else if (action === 'lock') {
      onMarkerLock(id);
      onMarkerToggle(id);
      onMarkerMouseOut();
    }
  }

  onMarkerDragEnd(marker) {
    const { onMarkerDragged } = this.props;
    let pos = marker.getLatLng();
    onMarkerDragged(marker._pointid, [pos.lat, pos.lng]);
  }

  onMarkerClicked(marker) {
    const { onMarkerToggle, selectedMarker } = this.props;
    const { markers } = this.state;

    const match = markers.find(m => m.id === marker._pointid);
    if (!match) return;

    const isSelected = selectedMarker === match.id;
    if (isSelected) return;

    onMarkerToggle(match.id, match.img, marker.getLatLng());
  }

  renderMarker(pt) {
    const { leafletMap, onMarkerMouseOut, onMarkerMouseOver } = this.props;
    if (!leafletMap) return;

    let me = this;
    let myIcon = new GCPIcon(ICON);
    let lat = pt.coord[0];
    let lng = pt.coord[1];

    let m = new GCPMarker([lat, lng], {
      icon: myIcon,
      draggable: true,
      onActionsClick: (evt) => {
        this.onActionsClick(evt, pt.id);
      }
    });

    m.addTo(leafletMap);
    m._pointid = pt.id;

    m.on('dragstart', function(evt) {
      me.setState({ dragging: true });
    });

    m.on('dragend', function(evt) {
      me.setState({ dragging: false });
      me.onMarkerDragEnd(this);
    });

    m.on('click', function(evt) {
      me.onMarkerClicked(this);
    });

    m.on('mouseout', () => {
      if (!this.state.dragging) {
        onMarkerMouseOut(pt.id);
      }
    });
    m.on('mouseover', () => onMarkerMouseOver(pt.id));

    return {
      marker: m,
      id: pt.id,
      img: pt.img,
      hasImage: pt.hasImage,
      label: pt.label
    };
  }

  render() {
    const { leafletMap } = this.props;
    if (!leafletMap) return null;

    return (
      <div/>
    );
  }
}

export default PointMarkersMap;
