;(function (factory) {
  var L;
  if (typeof module !== 'undefined') {
    // Node/CommonJS
    L = require('leaflet');
    module.exports = factory(L);
  } else {
    // Browser globals
    if (typeof window.L === 'undefined') {
      throw new Error('Leaflet must be loaded first');
    }
    factory(window.L);
  }
}(function (L) {
  'use strict';

  const CONTAINER_CLASS = 'leaflet-map-providers leaflet-bar leaflet-control';
  const PROVIDER_ITEM_CLASS = 'provider-item';

  // Bing tileLayer
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

  L.Control.MapProviders = L.Control.extend({
    version: '1.0.0',

    options: {
      providers: [],
      custom_desc: 'Enter a template string',
      initial_open: false
    },

    initialize: function (options) {
      L.Util.setOptions(this, options);

      this.state = {
        selected: this.options.selected,
        custom: null,
        open: this.options.initial_open
      };
    },

    createProviderButton: function (parent, provider) {
      let li = L.DomUtil.create('li', this.getProviderItemClass(provider.id), parent);
      li.dataset.id = provider.id;

      let label = L.DomUtil.create('label', null, li);
      let input = L.DomUtil.create('input', 'input', label);
      input.type = 'radio';
      input.value = provider.id;

      let txt = L.DomUtil.create('span', null, label);
      txt.innerHTML = provider.label;
    },

    createCustomButton: function (parent) {
      let li = L.DomUtil.create('li', this.getProviderItemClass('custom'), parent);
      li.dataset.id = 'custom';

      let label = L.DomUtil.create('label', null, li);

      let input = L.DomUtil.create('input', 'input custom-provider', label);
      input.type = 'radio';
      input.value = 'custom';

      let txt = L.DomUtil.create('span', null, label);
      txt.innerHTML = 'Custom';

      let custom_container = L.DomUtil.create('div', null, label);
      let desc = L.DomUtil.create('p', '', custom_container);
      desc.innerHTML = this.options.custom_desc;

      let custom_input = L.DomUtil.create('input', 'input', custom_container);
      custom_input.type = 'text';
      custom_input.placeholder = 'Enter';

      let apply_btn = L.DomUtil.create('button', 'btn', custom_container);
      apply_btn.innerHTML = 'Apply';

      L.DomEvent
        .on(apply_btn, 'click', e => {
          this.onCustomProviderClick(e, custom_input.value);
        });
    },

    setProviderRadioButton: function(li, id) {
      let input = li.querySelector('input[type="radio"]');
      if (!input) return;

      input.checked = this.state.selected === id;
    },

    getProviderItemClass: function(id) {
      return this.state.selected === id ? PROVIDER_ITEM_CLASS + ' selected' : PROVIDER_ITEM_CLASS;
    },

    getContainerClass: function () {
      return this.state.open ? CONTAINER_CLASS + ' open' : CONTAINER_CLASS;
    },

    onAdd: function (map) {
      let container = this._container = L.DomUtil.create('div', this.getContainerClass());

      let h4 = L.DomUtil.create('h4', '', container);
      L.DomUtil.create('span', 'icon providers', h4);
      let h4_text = L.DomUtil.create('span', '', h4);
      h4_text.innerHTML = 'Map Provider';

      let ul = L.DomUtil.create('ul', 'list-reset', container);

      this.options.providers.forEach(p => this.createProviderButton(ul, p));

      this.createCustomButton(ul);

      L.DomEvent
        .on(h4, 'click', e => this.setToggleState(e))
        .on(ul, 'click', e => this.onProviderItemClick(e));

      this.setProvider();

      return container;
    },

    onRemove: function(map) {

    },

    getClosest: function ( elem, selector ) {

      // Element.matches() polyfill
      if (!Element.prototype.matches) {
          Element.prototype.matches =
              Element.prototype.matchesSelector ||
              Element.prototype.mozMatchesSelector ||
              Element.prototype.msMatchesSelector ||
              Element.prototype.oMatchesSelector ||
              Element.prototype.webkitMatchesSelector ||
              function(s) {
                let matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
              };
      }

      // Get closest match
      for ( ; elem && elem !== document; elem = elem.parentNode ) {
        if ( elem.matches( selector ) ) return elem;
      }

      return null;
    },

    setToggleState: function(e) {
      L.DomEvent.stopPropagation(e);
      this.state.open = !this.state.open;
      L.DomUtil.setClass(this._container, this.getContainerClass());
    },

    setProvider: function() {
      let selected = this.state.selected;
      let custom = this.state.custom;

      let items = this._container.querySelectorAll('li');
      for (let i = 0; i < items.length; ++i) {
        let id = items[i].dataset.id;
        L.DomUtil.setClass(items[i], this.getProviderItemClass(id));
        this.setProviderRadioButton(items[i], id);
      }

      if (selected === 'custom' && custom) {
        L.tileLayer(custom, {
            attribution: '',
            maxZoom: 19
        }).addTo(this._map);

        return;
      }

      let provider = this.options.providers.find(p => p.id === selected);

      if (provider) {
        if (provider.useBing) {
          L.tileLayer.bing(provider.url, {
              attribution: provider.attribute,
              maxZoom: provider.maxZoom
          }).addTo(this._map);
        } else {
          L.tileLayer(provider.url, {
              attribution: provider.attribute,
              maxZoom: provider.maxZoom
          }).addTo(this._map);
        }
      }
    },

    onProviderItemClick: function(e) {
      L.DomEvent.stop(e);
      let target = e.target || e.srcElement;
      if (!target) return;

      let item = this.getClosest(target, '.provider-item');
      if (!item) return;

      let input = item.querySelector('input[type="radio"]');
      if (!input) return;

      this.state.selected = input.value;
      this.setProvider();
    },

    onCustomProviderClick: function(e, value) {
      L.DomEvent.stop(e);
      value = value.trim();
      if (value === this.state.custom) return;

      this.state.custom = value;
      this.setProvider();
    }

  });

  L.control.mapProviders  = function (options) {
    return new L.Control.MapProviders(options);
  };
}));