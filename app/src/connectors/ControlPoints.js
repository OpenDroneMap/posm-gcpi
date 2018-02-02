import { connect } from 'react-redux';
import ControlPoints from '../components/ControlPoints';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, {})(ControlPoints);