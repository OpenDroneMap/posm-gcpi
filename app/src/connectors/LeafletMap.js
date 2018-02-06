import { connect } from 'react-redux';
import { toggleControlPointMode, setControlPointPosition, deleteControlPoint, highlightControlPoint, addControlPoint, joinControlPoint } from '../state/actions';
import LeafletMap from '../components/LeafletMap';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, { toggleControlPointMode, setControlPointPosition, deleteControlPoint, joinControlPoint, highlightControlPoint, addControlPoint })(LeafletMap);
