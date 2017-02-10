import {connect} from 'react-redux';
import {receiveImageFiles, receiveGcpFile} from '../state/actions';
import ImagesGetter from '../components/ImagesGetter';


export default connect((state) => ({}), {receiveImageFiles, receiveGcpFile})(ImagesGetter);