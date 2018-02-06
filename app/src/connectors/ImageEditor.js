import { connect } from 'react-redux';
import { setControlPointPosition, deleteControlPoint, toggleControlPointMode, highlightControlPoint, addControlPoint, joinControlPoint } from '../state/actions';
import ImageEditor from '../components/ImageEditor';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, { setControlPointPosition, deleteControlPoint, toggleControlPointMode, highlightControlPoint, addControlPoint, joinControlPoint })(ImageEditor);
