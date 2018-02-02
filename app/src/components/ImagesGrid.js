import React, { Component, PropTypes } from 'react';
import ImagesGridThumb from './ImagesGrid-Thumb';
import { CP_TYPES } from '../state/utils/controlpoints';

class ImagesGrid extends Component {
  static propTypes = {
    selectImageFile: PropTypes.func
  }

  static defaultProps = {
    selectImageFile: () => {}
  }

  constructor(props) {
    super(props);

    this.onImageClick = this.onImageClick.bind(this);
    this.onDeleteImage = this.onDeleteImage.bind(this);
  }

  onImageClick(file, selected) {
    const { selectImageFile, toggleMenu } = this.props;
    if (!file) return;

    // If already selected, open menu
    if (selected) {
      toggleMenu();
    }
    else {
      selectImageFile(file.name);
    }
  }

  onDeleteImage(filename) {
    const { deleteImageFile } = this.props;
    deleteImageFile(filename);
  }

  renderImages() {
    const { imagery, controlpoints } = this.props;
    const selected = imagery.selected;

    let images = imagery.items || [];

    // TODO (sean): Move this to reducer at some point
    let rollup = {};

    controlpoints.points.forEach(pt => {
      if (pt.type !== CP_TYPES.IMAGE) return;

      if (!rollup.hasOwnProperty(pt.img_name)) {
        rollup[pt.img_name] = 0;
      }
      rollup[pt.img_name]++;
    });

    if (Array.isArray(imagery.items)) {
      images.forEach(img => {
        if (!rollup.hasOwnProperty(img.name)) {
          rollup[img.name] = 0;
        }
      });
    }


    return Object.keys(rollup).map(key => {
      let pts = rollup[key];
      let isSelected = (key === selected);
      let file = images.find(d => d.name === key);

      return (
        <ImagesGridThumb key={key}
          src={file}
          filename={key}
          onThumbClick={this.onImageClick}
          onDeleteImage={this.onDeleteImage}
          points={pts}
          selected={isSelected}/>
      );
    });
  }

  render() {
    return (
      <div className='images-grid'>
        <div className='wrapper'>
          {this.renderImages()}
        </div>
      </div>
    );
  }
}

export default ImagesGrid;
