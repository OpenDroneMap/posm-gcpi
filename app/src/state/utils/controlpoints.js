export const CP_TYPES = {
  MAP: 'map',
  IMAGE: 'image'
}

export const CP_MODES = {
  ADDING: 'adding',
  MAP_EDIT: 'map_edit',
  IMAGE_EDIT: 'img_edit',
  DEFAULT: null
}

const generateID = (coord, img_name='') => {
  return `${coord.join('_')}_${img_name}_${Date.now()}`;
}

const validCoordinate = (coord) => {
  if (Array.isArray(coord) !== true) return false;
  return coord.length > 1 && !coord.some(isNaN);
}

export const getModeFromId = (id, points) => {
  let f = points.find(p => p.id === id);
  if (!f) return CP_MODES.DEFAULT;

  if (f.type === CP_TYPES.MAP) return CP_MODES.MAP_EDIT;

  return CP_MODES.IMAGE_EDIT;
}

// returns image point object
export const imagePoint = (coord, img_name, hasImage=true) => {
  if (!validCoordinate(coord) || typeof img_name !== 'string') return null;

  return {
    img_name,
    type: CP_TYPES.IMAGE,
    coord: [...coord],
    id: generateID(coord, img_name),
    hasImage
  }
}

// returns map point object
export const mapPoint = (coord) => {
  if (!validCoordinate(coord)) return null;

  return {
    type: CP_TYPES.MAP,
    coord: [...coord],
    id: generateID(coord)
  }
}


export const validate = (points) => {
  if (points.length < 15) {
    console.warn('Not enough points. Need at least 15 points.');
    return false;
  }
  // TODO: update to newer points model
  // remove return once done
  return true;

  // unique map location points
  let uniques = {};
  points.forEach(pt => {
    let loc = pt.locations;
    if (!loc) return;

    let k = loc.map.join(':');

    if (!uniques[k]) uniques[k] = {ct: 0, imgs: []};
    uniques[k].ct++;
    uniques[k].imgs.push(pt.img);
  });

  // check if each point has 3 images associated with it
  let valid = Object.keys(uniques).filter(d => d.imgs >= 3);

  if (valid.length < 5) {
    console.warn('A point on the map must be referenced in 3 images.');
    return false;
  }

  return true;
};
