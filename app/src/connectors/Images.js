import { connect } from 'react-redux';
import { selectImageFile,
        deleteImageFile,
        toggleControlPointMode,
        setControlPointPosition,
        deleteControlPoint } from '../state/actions';

import Images from '../components/Images';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, {
                        selectImageFile,
                        deleteImageFile,
                        toggleControlPointMode,
                        setControlPointPosition,
                        deleteControlPoint
                      })(Images);