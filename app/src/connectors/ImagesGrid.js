import { connect } from 'react-redux';
import { selectImageFile, deleteImageFile, toggleMenu } from '../state/actions';

import ImagesGrid from '../components/ImagesGrid';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, { selectImageFile, deleteImageFile, toggleMenu })(ImagesGrid);
