import {connect} from 'react-redux';
import {receiveImageFiles, setControlPointPosition} from '../state/actions';
import ImagesGetter from '../components/ImagesGetter';


export default connect((state) => ({}), {receiveImageFiles, setControlPointPosition})(ImagesGetter);