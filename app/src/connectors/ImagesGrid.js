import {connect} from 'react-redux';
import {selectImageFile, deleteImageFile} from '../state/actions';

import ImagesGrid from '../components/ImagesGrid';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, {selectImageFile, deleteImageFile})(ImagesGrid);