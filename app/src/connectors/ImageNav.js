import { connect } from 'react-redux';
import { toggleMenu, awaitControlPoint } from '../state/actions';

import ImagesNav from '../components/ImageNav';

const mapStateToProps = (state) => state;
export default connect(mapStateToProps, { toggleMenu, awaitControlPoint })(ImagesNav);