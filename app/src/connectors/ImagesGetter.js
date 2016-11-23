import {connect} from 'react-redux';
import {receiveImageFiles} from '../state/actions';
import ImagesGetter from '../components/ImagesGetter';


export default connect((state) => ({}), {receiveImageFiles})(ImagesGetter);