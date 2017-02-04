import {combineReducers} from 'redux';
import * as actions from './actions';

const INITIAL_STATE = {};
// const identity = (state = INITIAL_STATE, action) => state;

function controlpoints(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.DELETE_CONTROL_POINT:
      return {
        ...state,
        active: false,
        imageIndex: null,
        pointIndex: null,
        points: state.points.filter(pt => {
          return pt.id !== action.id;
        })
      }

    case actions.ADD_CONTROL_POINT:
      return {
        ...state,
        points: [
          ...state.points,
          {
            imageIndex: action.imageIndex,
            id: Date.now(),
            locations: {
              map: null,
              image: null
            }
          }
        ]
      }
    case actions.UPDATE_CONTROL_POINT:
      let points = state.points.map((pt, idx) => {
        if (idx === state.pointIndex) {
          return {
            ...pt,
            locations: {
              ...pt.locations,
              [state.location]: action.loc
            }
          }
        }

        return pt;
      });
      return {
        ...state,
        active: false,
        imageIndex: null,
        pointIndex: null,
        points
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
        pointId: active ? action.pointId : null
      }

      if (active && action.point) {
        st.points = [
          ...state.points,
          {
            imageIndex: action.imageIndex,
            id: Date.now(),
            locations: {
              ...action.point
            }
          }
        ];
      }
      return st;

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
    case actions.RECEIVE_IMAGE_FILES:
      return {
        ...state,
        items: action.items,
        receivedAt: action.receivedAt,
        selected: 0
      };

    default:
      return state;
  }
}

const combinedReducers = combineReducers({
  imagery,
  controlpoints
});


export default function rootReducer(state = INITIAL_STATE, action) {
  return combinedReducers.apply(null, arguments);
}