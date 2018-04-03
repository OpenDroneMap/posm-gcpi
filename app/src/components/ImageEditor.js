import React, { Component } from 'react';
import ImagePanZoom from './ImagePanZoom';
import { CP_MODES } from '../state/utils/controlpoints';

class ImageEditor extends Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.onImageDragged = this.onImageDragged.bind(this);
    this.onMarkerDragged = this.onMarkerDragged.bind(this);
    this.onMarkerDelete = this.onMarkerDelete.bind(this);
    this.onMarkerLock = this.onMarkerLock.bind(this);
    this.onMarkerToggle = this.onMarkerToggle.bind(this);
  }

  onImageDragged(center) {
    const { onImagePositionChange } = this.props;
    onImagePositionChange(center);
  }

  onMarkerDragged(marker_id, pos) {
    const { setControlPointPosition } = this.props;
    setControlPointPosition('image', marker_id, pos);
  }

  onMarkerDelete(marker_id) {
    const { deleteControlPoint } = this.props;
    deleteControlPoint(marker_id);
  }

  onMarkerLock(marker_id) {
    const { lockControlPoint } = this.props;
    lockControlPoint(marker_id);
  }

  onMarkerToggle(marker_id) {
    const { controlpoints, toggleControlPointMode, joinControlPoint } = this.props;

    if (controlpoints.mode === CP_MODES.MAP_EDIT) {
        return joinControlPoint(marker_id);
    }

    toggleControlPointMode(marker_id);
  }

  getImageFile() {
    const { imagery } = this.props;

    let image = null;
    if (imagery.items) {
      let match = imagery.items.filter(f => f.name === imagery.selected);
      if (match.length) image = match[0];
    }

    return image;
  }

  render() {
    const { controlpoints, clearAutomaticControlPoints, imagepanel, imagery, height, highlightControlPoint, addControlPoint, addAutomaticControlPoint } = this.props;

    return (
      <div className='image-editor'>
        <ImagePanZoom
          clearAutomaticControlPoints={clearAutomaticControlPoints}
          height={height}
          onMarkerDragged={this.onMarkerDragged}
          onMarkerDelete={this.onMarkerDelete}
          onMarkerLock={this.onMarkerLock}
          onMarkerToggle={this.onMarkerToggle}
          onImageDragged={this.onImageDragged}
          joins={controlpoints.joins}
          markers={controlpoints.points}
          mode={controlpoints.mode}
          selectedMarker={controlpoints.selected}
          image={this.getImageFile()}
          selectedImage={imagery.selected}
          highlightedControlPoints={controlpoints.highlighted}
          highlightControlPoint={highlightControlPoint}
          addAutomaticControlPoint={addAutomaticControlPoint}
          addControlPoint={addControlPoint}
          visible={!imagepanel.menu_active}
        />
      </div>
    );
  }
}

export default ImageEditor;
