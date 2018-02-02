import { connect } from 'react-redux';
import App from '../components/App';
import { onWindowResize, toggleExport, addControlPoint } from '../state/actions';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, { onWindowResize, toggleExport, addControlPoint })(App);