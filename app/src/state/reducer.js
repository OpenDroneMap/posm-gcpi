import { combineReducers } from 'redux';
import * as actions from './actions';

import controlPointReducer from './reducers/controlpoints';

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

function imagepanel(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.TOGGLE_MENU:
      return {
        menu_active: !state.menu_active
      }

    default:
      return state;
  }
}

const controlpoints = controlPointReducer(INITIAL_STATE);

function imagery(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.SELECT_IMAGE:
      return {
        ...state,
        selected: action.img_name
      }

    case actions.DELETE_IMAGE:
      if (!Array.isArray(state.items)) return state;

      return {
        ...state,
        items: state.items.filter(d => {
          return d.name !== action.name;
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
        selected: state.selected || action.items[0].name
      };

    case actions.PREVIEW_GCP_FILE:
      return {
        ...state,
        receivedAt: action.receivedAt,
        gcp_list: null,
        gcp_list_preview: true,
        gcp_list_text: action.gcp_list_text,
        gcp_list_name: action.file_name
      }

    case actions.PREVIEW_GCP_FILE_CANCEL:
      return {
        ...state,
        gcp_list_preview: false,
        gcp_list_text: null,
        gcp_list_name: null
      }

    case actions.RECEIVE_GCP_FILE:
      return {
        ...state,
        projection: action.projection,
        gcp_list: action.rows,
        gcp_list_preview: false,
        gcp_list_text: null,
        gcp_list_name: action.file_name
      }

    default:
      return state;
  }
}

const combinedReducers = combineReducers({
  imagery,
  controlpoints,
  windowSize,
  exporter,
  imagepanel
});


export default function rootReducer(state = INITIAL_STATE, action) {
  return combinedReducers.apply(null, arguments);
}
