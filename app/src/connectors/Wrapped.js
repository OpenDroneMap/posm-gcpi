import { connect } from 'react-redux';
import App from './App';

import { addControlPoint } from '../state/actions';

import Wrapped from '../components/Wrapped';

const mapStateToProps = (state) => {
  return {
    mode: state.controlpoints.mode
  }
};
export default connect(mapStateToProps, { addControlPoint })(Wrapped(App));