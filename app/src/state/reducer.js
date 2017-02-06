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
            imageIndex: action.imageIndex,
            id: now,
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