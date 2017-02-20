const config = {
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
  custom_description: 'Enter a tile URL template. Valid tokens ar {z}, {x}, {y}, for Z/X/Y scheme and {u} for quadtile scheme.'
};

export default config;