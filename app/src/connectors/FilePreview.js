import { connect } from 'react-redux';

import { previewGcpFileCancel, receiveGcpFile } from '../state/actions';
import FilePreview from '../components/FilePreview';

const mapStateToProps = (state) => {
  return {
    errors: state.imagery.gcp_list_preview_errors,
    filename: state.imagery.gcp_list_name,
    previewText: state.imagery.gcp_list_text
  };
};
export default connect(mapStateToProps, { previewGcpFileCancel, receiveGcpFile })(FilePreview);
