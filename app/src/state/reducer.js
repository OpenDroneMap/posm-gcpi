import {combineReducers} from 'redux';
import * as actions from './actions';

const INITIAL_STATE = {};
// const identity = (state = INITIAL_STATE, action) => state;

function controlpoints(state = INITIAL_STATE, action) {
  switch (action.type) {
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
        location: null,
        imageIndex: null,
        pointIndex: null,
        points
      }
    case actions.TOGGLE_CONTROL_POINT_MODE:
      let active;
      if (action.location === state.location && action.imageIndex === state.imageIndex && action.pointIndex === state.pointIndex) {
        active = !state.active
      } else {
        active = true;
      }
      return {
        ...state,
        active: active,
        location: action.location,
        imageIndex: action.imageIndex,
        pointIndex: action.pointIndex
      }
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