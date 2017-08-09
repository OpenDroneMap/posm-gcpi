import {connect} from 'react-redux';
import {receiveImageFiles, receiveGcpFile, gcpProcessed} from '../state/actions';
import ImagesGetter from '../components/ImagesGetter';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, {receiveImageFiles, receiveGcpFile, gcpProcessed})(ImagesGetter);