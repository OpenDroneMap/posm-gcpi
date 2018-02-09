import { connect } from 'react-redux';
import { receiveImageFiles, previewGcpFile } from '../state/actions';
import ImagesGetter from '../components/ImagesGetter';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, { receiveImageFiles, previewGcpFile })(ImagesGetter);
