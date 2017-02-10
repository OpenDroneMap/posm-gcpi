import React from 'react';
import ReactDOM from 'react-dom';
import App from './connectors/App';
import WrappedApp from './components/Wrapped';

const ConnectedApp = WrappedApp(App);

// Redux
import { Provider } from 'react-redux'
import configureStore from './state/store';

// Styles
import 'ace-css/css/ace.min.css';
import 'leaflet/dist/leaflet.css';
import './styles/main.css';


const store = configureStore({imagery: {}, controlpoints:{points:[]}});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
);
