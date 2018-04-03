import { connect } from 'react-redux';
import { clearAutomaticControlPoints, setControlPointPosition, deleteControlPoint, lockControlPoint, toggleControlPointMode, highlightControlPoint, addAutomaticControlPoint, addControlPoint, joinControlPoint } from '../state/actions';
import ImageEditor from '../components/ImageEditor';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, { clearAutomaticControlPoints, setControlPointPosition, deleteControlPoint, lockControlPoint, toggleControlPointMode, highlightControlPoint, addAutomaticControlPoint, addControlPoint, joinControlPoint })(ImageEditor);
