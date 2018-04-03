import { connect } from 'react-redux';
import { toggleControlPointMode, setControlPointPosition, deleteControlPoint, lockControlPoint, highlightControlPoint, addAutomaticControlPoint, addControlPoint, joinControlPoint } from '../state/actions';
import LeafletMap from '../components/LeafletMap';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, { toggleControlPointMode, setControlPointPosition, deleteControlPoint, lockControlPoint, joinControlPoint, highlightControlPoint, addAutomaticControlPoint, addControlPoint })(LeafletMap);
