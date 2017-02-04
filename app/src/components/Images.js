import React, { Component } from 'react';
import ImagePanZoom from './ImagePanZoom';

class Images extends Component {

  constructor(props) {
    super(props);
    this.onImagePositionChange = this.onImagePositionChange.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
  }

  onImageSelect(idx) {
    const {selectImageFile, imagery} = this.props;
    if (imagery.selected === idx) return;
    selectImageFile(idx);
  }

  onImagePositionChange(xy, markerId) {
    const {controlpoints, updateControlPoint, onImagePositionChange, setControlPointPosition} = this.props;
    onImagePositionChange(xy);

    // update control point if in edit mode
    if (controlpoints.active && markerId) {
      setControlPointPosition('image', markerId, xy);
    }
  }

  toggleEditing(evt, imageid, pointtId, addPt) {
    evt.preventDefault();

    if (!addPt) return this.props.toggleControlPointMode(imageid, pointtId, null);

    let positions = this.props.getPositions();
    this.props.toggleControlPointMode(imageid, pointtId, {
      image: [...positions.image],
      map: [positions.map.lat, positions.map.lng]
    });
  }

  deleteGCP(id) {
    this.props.deleteControlPoint(id);
  }

  renderImagess() {
    const {imagery, controlpoints} = this.props;
    return imagery.items.map((item, idx) => {
      let klass = (imagery.selected === idx) ? 'selected' : '';
      if (imagery.selected === idx) {
        return <li key={item.file.name} className={klass} onClick={() => this.onImageSelect(idx)}>
          <span className='filename'>{item.file.name}</span>
          <ImagePanZoom image={imagery.items[imagery.selected].file} selectedImage={imagery.selected} onMouseUp={this.onImagePositionChange} points={controlpoints.points}/>
        </li>;
      }

      return <li key={item.file.name} className={klass} onClick={() => this.onImageSelect(idx)}>
        <span className='filename'>{item.file.name}</span>
      </li>;
    });
  }

  renderPoints(imgIndex) {
    const {controlpoints, imagery} = this.props;
    let klass;
    let points = [];

    controlpoints.points.forEach((pt, idx) => {
      klass = (controlpoints.active && pt.id === controlpoints.pointId) ? 'active' : '';
      if (controlpoints.active && controlpoints.pointId === null) klass += ' disabled';
      points.push(
        <li key={`pt-${idx}`} className={klass}>
          <button onClick={(evt) => {this.toggleEditing(evt, imgIndex, pt.id);}}>
          <span className={`icon gcp ${klass}`}></span>Ground Control Point</button>
          <span className='icon remove' onClick={() => {this.deleteGCP(pt.id);}}></span>
        </li>
      );
    })

    klass = (controlpoints.active && controlpoints.pointId === null) ? 'active' : '';
    points.push(<li key='pt' className={klass}><button onClick={(evt) => {this.toggleEditing(evt, imgIndex, null, true);}}><span className={`icon gcp add ${klass}`}></span>Add Ground Control Point</button></li>);
    return points;
  }

  renderImages() {
    const {imagery, controlpoints, onImagePositionChange} = this.props;
    let imageryItems = imagery.items ? imagery.items : [];
    let imagesLength = Math.max(imageryItems.length, 5);
    let range = Array.from({length: imagesLength}, (value, key) => key);

    return range.map(idx => {
      let isImage = imageryItems[idx];
      let isSelected = imagery.selected === idx;
      let klasses = [];
      if (imagery.selected === idx) klasses.push('selected');
      if (!isImage) klasses.push('empty');

      let image_name = imageryItems[idx] ? imageryItems[idx].name : '';

      return (
        <li key={`image-${idx}`} className={klasses.join(' ')} onClick={() => this.onImageSelect(idx)}>
          <div className='wrapper'>
            <div className='details'>
              <span className='blocker'></span>
              <span className='icon add'></span>
              <span className='img-name'>{image_name}</span>
              <span className='icon remove'></span>
            </div>
            { isImage && isSelected &&
            <ul className='gcp-controls'>
              {this.renderPoints(idx)}
            </ul>
            }
            { isImage && isSelected &&

            <div className='img-container'>
              <ImagePanZoom
                image={imagery.items[imagery.selected]}
                selectedImage={imagery.selected}
                points={controlpoints.points}
                markerDraggable={controlpoints.active}
                onImagePositionChange={this.onImagePositionChange}/>
            </div>
            }
          </div>
        </li>
      );
    });

    return null;

  }

  render() {
    if (typeof this.props.imagery === 'undefined') return null;
    const {controlpoints, imagery, points} = this.props;

    return (
      <div className='images-module'>
        <ul className='list-reset'>
          {this.renderImages()}
        </ul>
      </div>
    );
  }
}

export default Images;