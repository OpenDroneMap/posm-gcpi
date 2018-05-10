import proj4 from 'proj4';

import { createReducer } from '../utils/common';
import * as actions from '../actions';
import { validate, imagePoint, joinedPoints, relatedPoints, mapPoint, getModeFromId, CP_TYPES, CP_MODES } from '../utils/controlpoints';


const removeMapPointFromJoins = (joins, map_id) => {
  let r = {};
  let keys = Object.keys(joins);

  keys.forEach(k => {
    if (joins.hasOwnProperty(k) && k !== map_id) {
      r[k] = [...joins[k]];
    }
  });

  // nothing was changed, return orignial
  if (keys.length === Object.keys(r).length) return joins;

  return r;
}

const removeImagePointFromJoins = (joins, img_id) => {
  let touched = false;

  Object.keys(joins).forEach(k => {
    if (joins.hasOwnProperty(k) && joins[k].indexOf(img_id) > -1) {
      joins[k] = joins[k].filter(d => d !== img_id);
      touched = true;
    }
  });

  // nothing was changed, return orignial
  if (!touched) return joins;

  return {
    ...joins
  };
}

const removeFromJoins = (joins, pt) => {
  if (pt.type === CP_TYPES.MAP) return removeMapPointFromJoins(joins, pt.id);
  return removeImagePointFromJoins(joins, pt.id);
}

const onDeleteImage = (state, action) => {
  let pts = state.points.filter(pt => {
    return pt.type === CP_TYPES.IMAGE && pt.img_name === action.img_name;
  });

  if (!pts.length) return state;

  let { joins } = state;
  pts.forEach(pt => {
    joins = removeFromJoins(joins, pt);
  });

  let points = state.points.filter(pt => {
    if (pt.type === CP_TYPES.MAP) return true;
    return pt.img_name !== action.img_name;
  });

  return {
    ...state,
    mode: null,
    selected: null,
    points,
    joins,
    status: validate(points, joins)
  }
}

const deletePoint = (state, action) => {
  let pt = state.points.find(p => p.id === action.id);

  if (pt === undefined) return state;

  let st = {
    ...state,
    selected: null,
    mode: null,
    points: state.points.filter(p => {
      return p.id !== action.id;
    })
  }

  st.joins = removeFromJoins(st.joins, pt);
  st.status = validate(st.points, st.joins);

  return st;
}

const joinPoints = (joins, img_id, map_id) => {
  const newJoins = { ...joins };
  if (!joins.hasOwnProperty(map_id)) {
    newJoins[map_id] = [];
  }

  // We're adding the point if it is not in the given joins
  const addingPoint = (newJoins[map_id].indexOf(img_id) < 0);

  // If there any joins for this img_id, remove it
  Object.keys(joins).forEach(map_id => {
    if (newJoins[map_id].indexOf(img_id) > -1) {
      newJoins[map_id] = newJoins[map_id].filter(d => d !== img_id);
    }
  });

  if (addingPoint) {
    newJoins[map_id].push(img_id);
  }
  return newJoins;
}


const joinPoint = (state, action) => {
  let img_id = state.mode === CP_MODES.IMAGE_EDIT ?
    state.selected :
    action.id;

  let map_id = state.mode === CP_MODES.MAP_EDIT ?
    state.selected :
    action.id;

  if (img_id === null && map_id === null ) return state;

  return {
    ...state,
    selected: null,
    mode: null,
    joins: joinPoints(state.joins, img_id, map_id)
  }
}

const highlightPoint = (state, action) => {
  let highlighted = [];
  if (action.id) {
    highlighted = relatedPoints(state.points, state.joins, action.id);
  }
  return {
    ...state,
    highlighted: highlighted
  };
}

// img_name, img_coord, map_coord
const addPoint = (state, action) => {
  let pt = action.isImage ?
    imagePoint(action.img_coord, action.img_name, false, action.isAutomatic) :
    mapPoint(action.map_coord, null, action.isAutomatic);
  if (pt === null) return state;

  let points = [...state.points];
  if (action.isAutomatic) {
    // If automatic, remove other automatic points of this type
    points = points.filter(p => !p.isAutomatic || p.type !== pt.type);
  }
  points.push(pt);

  let joins = state.joins || {};
  if (action.isAutomatic) {
    // If isAutomatic, look for automatic points of other type and join
    const joinPoint = points.filter(p => p.isAutomatic && p.type !== pt.type)[0];
    if (joinPoint) {
      let imgId, mapId;
      if (pt.type === CP_TYPES.IMAGE) {
        imgId = pt.id;
        mapId = joinPoint.id;
      }
      else {
        imgId = joinPoint.id;
        mapId = pt.id;
      }
      joins = joinPoints(joins, imgId, mapId);
    }
  }

  return {
    ...state,
    points,
    joins,
    selected: pt.id,
    mode: getModeFromId(pt.id, points),
    status: validate(points, joins)
  };
}

const lockPoint = (state, action) => {
  const joined = joinedPoints(state.joins, action.id);
  const points = state.points.map(p => {
    return {
      ...p,
      isAutomatic: p.isAutomatic && joined.filter(joinedPoint => joinedPoint.id === p.id) ? false : p.isAutomatic
    };
  });

  return {
    ...state,
    points
  }
}

const clearAutomaticControlPoints = (state, action) => {
  // Remove automatics from joins
  let joins = state.joins;
  state.points.forEach(p => {
    if (p.isAutomatic) joins = removeFromJoins(joins, p);
  });

  // Remove automatics from points
  const points = state.points.filter(p => !p.isAutomatic);

  return {
    ...state,
    joins,
    points
  };
}

const setPosition = (state, action) => {
  return {
    ...state,
    points: state.points.map((pt, idx) => {
              if (action.id === pt.id) {
                return {
                  ...pt,
                  coord: action.pos
                }
              }
              return pt;
            })
  }
}

const toggleMode = (state, action) => {
  let selected = (action.id === state.selected) ? null : action.id;
  let mode = selected ? getModeFromId(action.id, state.points) : null;

  return {
    ...state,
    selected,
    mode
  }
}

const syncImages = (state, action) => {
  let images = action.images || [];
  if (!images.length || !state.points.length) return state;

  return {
    ...state,
    points: state.points.map(pt => {
      let index = images.findIndex( img => img.name === pt.img_name );
      if (index < 0) return pt;

      return {
        ...pt,
        hasImage: true
      };
    })
  }
}

const parseRow = (row) => {
  let img_name, lat, lng, x, y, z, mapPointLabel;

  if (row.length === 6) {
    // If row length is 6, both image and coordinates are present
    [lng, lat, z, x, y, img_name] = row;
  }
  else if (row.length === 4) {
    // Just map points, no image
    [mapPointLabel, lng, lat, z] = row;
  }
  else if (row.length === 3) {
    // Just image points, no map coordinates
    [x, y, img_name] = row;
  }

  return { img_name, lat, lng, x, y, z, mapPointLabel };
}

const syncList = (state, action) => {
  let images = action.images || [];
  let rows = action.rows || []; // gcp file
  if (!rows.length) return state;

  let points = [...state.points];
  let joins = { ...state.joins };
  let selected = state.selected;
  let projection = action.sourceProjection;

  rows.forEach((r, i) => {
    let { img_name, lat, lng, z, x, y, mapPointLabel } = parseRow(r);

    let img_index = images.findIndex( img => img.name === img_name );
    let hasImage = img_index > -1;
    let imgPt, mapPt;

    if (x && y && img_name) {
      imgPt = imagePoint([x, y], img_name, hasImage);
    }

    if (lat && lng) {
      if (projection !== 'EPSG:4326') {
        // Transform into EPSG:4326
        try {
          [lng, lat] = proj4(projection, 'EPSG:4326', [lng, lat]);
        }
        catch (e) {
          return {
            ...state,
            status: {
              errors: `Invalid projection ${projection}`,
              valid: false
            }
          };
        }
      }
      mapPt = mapPoint([lat, lng], mapPointLabel, false, z);
    }

    if (imgPt) points.push(imgPt);
    if (mapPt) points.push(mapPt);

    if (imgPt && mapPt) {
      joins = joinPoints(joins, imgPt.id, mapPt.id);
    }

    if (!selected && imgPt) selected = imgPt.id;
  });

  return {
    ...state,
    points,
    joins,
    selected,
    mode: getModeFromId(selected, points),
    status: validate(points, joins)
  };
}

const awaitPoint = (state, action) => {
  if (state.mode === 'adding') return state;
  return {
    ...state,
    selected: null,
    mode: CP_MODES.ADDING
  }
}

const controlPointReducer = (state) => {
  return createReducer(state, {
    [actions.DELETE_CONTROL_POINT]: deletePoint,
    [actions.HIGHLIGHT_CONTROL_POINT]: highlightPoint,
    [actions.ADD_CONTROL_POINT]: addPoint,
    [actions.SET_CONTROL_POINT_POSITION]: setPosition,
    [actions.TOGGLE_CONTROL_POINT_MODE]: toggleMode,
    [actions.AWAIT_CONTROL_POINT]: awaitPoint,
    [actions.JOIN_CONTROL_POINT]: joinPoint,
    [actions.ADD_AUTOMATIC_CONTROL_POINT]: addPoint,
    [actions.CLEAR_AUTOMATIC_CONTROL_POINTS]: clearAutomaticControlPoints,
    [actions.LOCK_CONTROL_POINT]: lockPoint,
    'SYNC_IMAGES_TO_POINTS': syncImages,
    'SYNC_LIST_TO_IMAGES': syncList,
    'ON_DELETE_IMAGE': onDeleteImage
  });
}

export default controlPointReducer;
