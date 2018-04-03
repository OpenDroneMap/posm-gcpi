import proj4 from 'proj4';
import flattenDeep from 'lodash.flattendeep';
import toPairs from 'lodash.topairs';
import uniq from 'lodash.uniq';

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
export const imagePoint = (coord, img_name, hasImage=true, isAutomatic=false) => {
  if (!validCoordinate(coord) || typeof img_name !== 'string') return null;

  return {
    img_name,
    type: CP_TYPES.IMAGE,
    coord: [...coord],
    id: generateID(coord, img_name),
    hasImage,
    isAutomatic
  }
}

// returns map point object
export const mapPoint = (coord, label, isAutomatic=false) => {
  if (!validCoordinate(coord)) return null;

  return {
    type: CP_TYPES.MAP,
    coord: [...coord],
    id: generateID(coord),
    isAutomatic,
    label
  };
}

export const generateGcpOutput = (joins, points, sourceProjection, destinationProjection) => {
  let rows = [];

  Object.keys(joins).forEach(k => {
    let mapPoint = points.find(p => p.id === k);
    if (mapPoint === undefined) return;

    const transformedMapPoint = proj4(sourceProjection, destinationProjection, mapPoint.coord.slice().reverse());

    joins[k].forEach(ptId => {
      let point = points.find(p => p.id === ptId);
      if (point === undefined) return;
      rows.push([
        transformedMapPoint[0].toFixed(2),
        transformedMapPoint[1].toFixed(2),
        point.coord[2] || 0,
        point.coord[0].toFixed(2),
        point.coord[1].toFixed(2),
        point.img_name
      ].join('\t') );
    });

  });

  return rows;
}

/*
 * Get ids of all joined points given an id, including the passed id
 */
export const joinedPoints = (joins, id) => {
  return uniq(flattenDeep(toPairs(joins).filter(([key, values]) => id === key || values.indexOf(id) >= 0)));
}

/*
 * Get ids of all points related to a given an id, including the passed id
 */
export const relatedPoints = (points, joins, id) => {
  const joined = joinedPoints(joins, id);
  if (joined.length > 0) return joined;
  return points.filter(point => id === point.id).map(point => point.id);
};

// TODO(seanc): Not accounting for control objects having points from 3 different images
export const validate = (points, joins) => {
  let errors = [];

  if (points.length < 15) {
    errors.push('A ground control point file must have a minimum of 15 points. There needs to be 5 control objects and each control object must have 3 image points referenced. Please see this <a href="https://github.com/OpenDroneMap/OpenDroneMap/wiki/Running-OpenDroneMap#running-odm-with-ground-control" target="_blank">article</a> for more information.');
  }

  if (errors.length) {
    return {
      valid: false,
      errors
    };
  }

  let mapPoints = points.filter(pt => pt.type === CP_TYPES.MAP);
  let imgPointsLength = points.length - mapPoints.length;
  let joinKeys = Object.keys(joins);
  let validObjects = joinKeys.filter(d => d.length >= 3);

  if (imgPointsLength < 9) {
    errors.push('Need at least 10 image points.');
  }

  if (mapPoints.length < 5) {
    errors.push('Seems you have enough image points but not enough control objects. There must be at least 5.');
  } else if (joinKeys.length < 5) {
    errors.push('There must be at least 5 control points that have image points referenced.');
  } else if (validObjects.length < 5) {
    errors.push('Control objects must have at least 3 image points referenced.');
  }

  return {
    valid: errors.length ? false : true,
    errors
  }
};
