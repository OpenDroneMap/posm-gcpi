import {combineReducers} from 'redux';
import * as actions from './actions';

const INITIAL_STATE = {};
// const identity = (state = INITIAL_STATE, action) => state;
//
function windowSize(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.ON_WINDOW_RESIZE:
      return {
        ...state,
        size: action.size
      }

    default:
      return state;
  }
}

function exporter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.TOGGLE_EXPORT:
      return {
        active: !state.active
      }

    default:
      return state;
  }
}



function controlpoints(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.DELETE_CONTROL_POINT:
      return {
        ...state,
        active: false,
        imageIndex: null,
        pointIndex: null,
        adding: false,
        points: state.points.filter(pt => {
          return pt.id !== action.id;
        })
      }

    case actions.SET_CONTROL_POINT_POSITION:
      return {
        ...state,
        points: state.points.map((pt, idx) => {
                  if (action.id === pt.id) {
                    return {
                      ...pt,
                      locations: {
                        ...pt.locations,
                        [action.loc]: action.pos
                      }
                    }
                  }
                  return pt;
                })
      }

    case actions.TOGGLE_CONTROL_POINT_MODE:
      let active = !state.active

      const st = {
        ...state,
        active: active,
        imageIndex: active ? action.imageIndex : null,
        pointId: active ? action.pointId  : null,
        adding: false
      }

      if (active && action.point) {
        let now = Date.now();
        st.adding = true;
        st.pointId = now;

        st.points = [
          ...state.points,
          {
            imageName: action.imageName,
            imageIndex: action.imageIndex,
            hasImage: true,
            id: now,
            locations: {
              ...action.point,
              z: 0
            }
          }
        ];
      }
      return st;

    case 'SYNC_CONTROL_POINTS':
      //lng lat z1 pixelx1 pixely1 imagename1
      let images = action.images || [];
      let list = action.list || [];
      if (!list.length) return state;

      let pts = [...state.points];
      let now = Date.now();
      list.forEach((r,i) => {
        let index = images.findIndex( d => d.name === r[5] );

        if (index > -1) {
          pts.push({
            imageName: images[index].name,
            imageIndex: index,
            hasImage: true,
            id: now + i,
            locations: {
              map: [r[1], r[0]],
              image: [r[3], r[4]],
              z: r[2]
            }
          });
        }
      });

      return {
        ...state,
        points: pts
      };

    default:
      return state;
  }
}

function imagery(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.SELECT_IMAGE:
      return {
        ...state,
        selected: action.index
      }

    case actions.DELETE_IMAGE:
      return {
        ...state,
        items: state.items.filter(d => {
          return d.id !== action.id;
        })
      }

    case actions.RECEIVE_IMAGE_FILES:
      let items = state.items || [];
      return {
        ...state,
        items: [
          ...items,
          ...action.items
        ],
        receivedAt: action.receivedAt,
        selected: state.selected || 0
      };

    case actions.RECEIVE_GCP_FILE:
      return {
        ...state,
        projection: action.projection,
        gcp_list: action.rows
      }

    default:
      return state;
  }
}

const combinedReducers = combineReducers({
  imagery,
  controlpoints,
  windowSize,
  exporter
});


export default function rootReducer(state = INITIAL_STATE, action) {
  return combinedReducers.apply(null, arguments);
}