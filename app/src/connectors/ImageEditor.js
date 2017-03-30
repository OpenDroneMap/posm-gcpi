import {connect} from 'react-redux';
import {setControlPointPosition, deleteControlPoint, toggleControlPointMode, addControlPoint, joinControlPoint} from '../state/actions';
import ImageEditor from '../components/ImageEditor';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, {setControlPointPosition, deleteControlPoint, toggleControlPointMode, addControlPoint, joinControlPoint})(ImageEditor);