import classNames from 'classnames';
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

    return (
      <div className={classNames('image-nav', {
        editable: this.isEditable(),
        'mode-adding': controlpoints.mode === 'adding',
        'no-images': !this.hasImages()
      })}>
        <ToggleImageGridBtn
          imageSelected={!this.props.imagepanel.menu_active}
          onClick={(evt) => {this.onTogglerClick(evt);}}
        />
        <ControlPoints
          controlpoints={this.props.controlpoints}
          selectedImage={this.props.imagery.selected}
        />
        <AddPoint onClick={(evt) => {this.onAddPoint(evt);}}/>
      </div>
    );
  }
}

export default ImageNav;
