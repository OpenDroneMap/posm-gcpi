import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import reducer from './reducer';
import gcpiMiddleware from './middleware-gcpi';

const middleware = [ gcpiMiddleware ];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState);

  if (module.hot) {
    // enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}