import {connect} from 'react-redux';
import {toggleControlPointMode, updateControlPoint, addControlPoint} from '../state/actions';
import LeafletMap from '../components/LeafletMap';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, {toggleControlPointMode, updateControlPoint, addControlPoint})(LeafletMap);