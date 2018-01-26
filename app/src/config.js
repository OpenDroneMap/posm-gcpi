const config = {
  map_options: {
    minZoom: 2,
    scrollWheelZoom: false,
    zoomControl: false,
    initialZoom: 2,
    initialCenter: [30, -20]
  },
  map_providers: [
    {
      id: 'osm',
      label: 'OpenStreetMap',
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors</a>',
      maxZoom: 19
    },
    {
      id: 'satellite',
      label: 'Satellite',
      url: 'https://ecn.t{s}.tiles.virtualearth.net/tiles/a{q}.jpeg?g=587&mkt=en-gb&n=z',
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors</a>',
      maxZoom: 19,
      useBing: true
    }
  ],
  custom_placeholder: 'Enter template url...',
  custom_description: 'Enter a tile URL template. Valid tokens are {z}, {x}, {y}, for Z/X/Y scheme and {u} for quadtile scheme.',
  image_slider_zoom_max: 4,
  image_slider_step: 0.01,
  image_initial_scale: 0.5
};

export default config;
