import {createReducer} from '../utils/common';
import * as actions from '../actions';
import {validate, imagePoint, mapPoint, CP_TYPES} from '../utils/controlpoints';

const deletePoint = (state, action) => {
  let st = {
    ...state,
    selected: null,
    points: state.points.filter(pt => {
      return pt.id !== action.id;
    })
  }

  st.valid = validate(st.points);
  st.joins = removeFromJoins(st.joins, action);

  return st;
}

const removeFromJoins = (joins, pt) => {
  if (pt.type === CP_TYPES.MAP) return removeMapPointFromJoins(pt.id);
  return removeImagePointFromJoins(pt.id);
}

const removeImagePointFromJoins = (joins,  img_id) => {
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

const removeMapPointFromJoins = (joins,  map_id) => {
  let r = {};

  Object.keys(joins).forEach(k => {
    if (joins.hasOwnProperty(k) && k !== map_id) {
      r[k] = [...joins[k]];
    }
  });

  // nothing was changed, return orignial
  if (Object.keys(joins).length === Object.keys(r).length) return joins;

  return r;
}

const joinPoints = (joins, imgPt, mapPt) => {
  if (!joins.hasOwnProperty(mapPt.id)) {
    joins[mapPt.id] = [];

  } else if (joins[mapPt.id].index(imgPt.id) > -1) {
    // Check if image point exists for a particular map point
    // Not sure if this could happen but checking to be sure
    console.warn(`Image point ${imgPt.id} already exists for map point ${mapPt.id}`);
    return joins;
  }

  return {
    ...joins,
    [mapPt.id]: [...joins[mapPt.id], imgPt.id]
  };
}

// img_name, img_coord, map_coord
const addPoint = (state, action) => {
  let pt = action.isImage ? imagePoint(action.img_coord, action.img_name) :
                            mapPoint(action.map_coord);

  if (pt === null) return state;
  let points = [...state.points, pt];

  return {
    ...state,
    points,
    joins: {},
    selected: pt.id,
    mode: null,
    valid: validate(points)
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
  return {
    ...state,
    selected: (action.id === state.selected) ? null : action.id
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

const syncList = (state, action) => {
  let images = action.images || [];
  let list = action.list || []; // gcp file
  if (!list.length) return state;

  let points = [...state.points];
  let joins = {...state.joins};
  let selected = state.selected;

  list.forEach((r,i) => {
    let img_name = r[5];
    let lat = r[1];
    let lng = r[0];
    let x = r[3];
    let y = r[4];
    let z = r[2];

    let img_index = images.findIndex( img => img.name === img_name );
    let hasImage = img_index > -1;

    let imgPt = imagePoint([x, y, z], img_name, hasImage);
    let mapPt = mapPoint([lat, lng]);

    if (imgPt !== null) points.push(imgPt);
    if (mapPt !== null) points.push(mapPt);

    if (imgPt !== null && mapPt !== null) {
      joins = joinPoints(joins, imgPt, mapPt);
    }

    if (!selected) selected = imgPt.id;
  });

  return {
    ...state,
    valid: validate(points),
    points,
    joins,
    selected
  };
}

const awaitPoint = (state, action) => {
  if (state.mode === 'adding') return state;
  return {
    ...state,
    selected: null,
    mode: 'adding'
  }
}

const controlPointReducer = (state) => {
  return createReducer(state, {
    [actions.DELETE_CONTROL_POINT]: deletePoint,
    [actions.ADD_CONTROL_POINT]: addPoint,
    [actions.SET_CONTROL_POINT_POSITION]: setPosition,
    [actions.TOGGLE_CONTROL_POINT_MODE]: toggleMode,
    [actions.AWAIT_CONTROL_POINT]: awaitPoint,
    'SYNC_IMAGES_TO_POINTS': syncImages,
    'SYNC_LIST_TO_IMAGES': syncList
  });
}

export default controlPointReducer;


/*
  Point (these are Map location with an array of IMG_PT_OBJECTS)
  {
    images: [IMG_PT_OBJECT],
    latlng: [lat, lng],
    id: Number
  }

  IMG_PT_OBJECT
  {
    img_name: String,
    coord: [x, y],
    id: Number
  }

  ///////// OR ///////////////////////////////

  Map Point
  {
    id: Number,
    latlng: [lat, lng],
    join_to: Point id
  }

  Image Point
  {
    id: Number,
    img_name: String,
    coord: [x, y],
    join_to: Map id
  }

 */