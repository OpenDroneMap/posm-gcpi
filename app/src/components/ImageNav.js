import React, { Component } from 'react';
import ControlPoints from '../connectors/ControlPoints';

import ToggleImageGridBtn from './ToggleImageGridBtn';
import AddPoint from './buttons/AddPoint';

class ImageNav extends Component {

  onTogglerClick(evt) {
    evt.preventDefault();

    // keep menu open until images have been added
    if (!this.hasImages()) return;

    this.props.toggleMenu();
  }

  onAddPoint(evt) {
    evt.preventDefault();
    this.props.awaitControlPoint();
  }

  onFinishAddPoint(evt) {
    /*
    const {setControlPoint} = this.props;
    evt.preventDefault();
    setControlPoint();
    */
  }

  isEditable() {
    const { imagery, imagepanel } = this.props;
    return ((imagery.items && imagery.items.length) && !imagepanel.menu_active);
  }

  hasImages() {
    const { imagery } = this.props;
    return (imagery.items && imagery.items.length);
  }

  render() {
    const { controlpoints } = this.props;
    let editable = this.isEditable();
    let klass = editable ? ' editable' : '';

    if (!this.hasImages()) {
      klass += ' no-images';
    }

    if (controlpoints.mode === 'adding') {
      klass += ' mode-adding';
    }

    return (
      <div className={`image-nav${klass}`}>
        <ToggleImageGridBtn onClick={(evt) => {this.onTogglerClick(evt);}}/>
        <ControlPoints
          controlpoints={this.props.controlpoints}
          selectedImage={this.props.imagery.selected}
        />
        <AddPoint onAdd={(evt) => {this.onFinishAddPoint(evt);}} onClick={(evt) => {this.onAddPoint(evt);}}/>
      </div>
    );
  }
}

export default ImageNav;
