import {connect} from 'react-redux';
import {toggleControlPointMode, updateControlPoint, addControlPoint, setControlPointPosition} from '../state/actions';
import LeafletMap from '../components/LeafletMap';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, {toggleControlPointMode, updateControlPoint, addControlPoint, setControlPointPosition})(LeafletMap);