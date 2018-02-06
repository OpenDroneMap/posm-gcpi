import React from 'react';
import ReactDOM from 'react-dom';
import WrappedApp from './connectors/Wrapped';

// Redux
import { Provider } from 'react-redux'
import configureStore from './state/store';

// Styles
import 'ace-css/css/ace.min.css';
import 'leaflet/dist/leaflet.css';
import './styles/main.css';

// Default state
const DEFAULT_STATE = {
  imagepanel: { menu_active: true },
  imagery: {},
  controlpoints:{ highlighted: [], points:[], joins: {} }
};

// create store
const store = configureStore(DEFAULT_STATE);

ReactDOM.render(
  <Provider store={store}>
    <WrappedApp />
  </Provider>,
  document.getElementById('root')
);
