import {createStore} from 'redux';
import reducer from './reducer';

export default function configureStore(initialState) {
  const store = createStore(reducer, initialState);

  if (module.hot) {
    // enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}