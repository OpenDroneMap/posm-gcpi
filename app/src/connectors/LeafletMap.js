import {connect} from 'react-redux';
import {toggleControlPointMode, setControlPointPosition} from '../state/actions';
import LeafletMap from '../components/LeafletMap';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, {toggleControlPointMode, setControlPointPosition})(LeafletMap);