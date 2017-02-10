import {createStore, applyMiddleware} from 'redux';
import reducer from './reducer';


const syncImagesToListMiddleware = store => next => action => {
  let tmpState = store.getState();
  if (action.type === 'RECEIVE_GCP_FILE') {
    store.dispatch({
      type: 'SYNC_CONTROL_POINTS',
      images: tmpState.imagery.items,
      list: action.rows
    })
  } else if (action.type === 'RECEIVE_IMAGE_FILES') {
    store.dispatch({
      type: 'SYNC_CONTROL_POINTS',
      images: action.items,
      list: tmpState.imagery.gcp_list
    })
  }
  next(action);
};

const middleware = applyMiddleware(syncImagesToListMiddleware);

export default function configureStore(initialState) {
  const store = createStore(reducer, initialState, middleware);

  if (module.hot) {
    // enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}