import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

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
    <App />
  </Provider>,
  document.getElementById('root')
);
