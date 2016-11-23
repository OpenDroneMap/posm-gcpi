import React, { Component } from 'react';
import ImagePanZoom from './ImagePanZoom';

class Images extends Component {

  constructor(props) {
    super(props);
    this.onImageMouseUp = this.onImageMouseUp.bind(this);
  }

  onImageSelect(idx) {
    const {selectImageFile, imagery} = this.props;
    if (imagery.selected === idx) return;
    selectImageFile(idx);
  }

  onImageMouseUp(x, y) {
    const {controlpoints, updateControlPoint} = this.props;
    if (!controlpoints.active || (controlpoints.location !== 'image')) return;
    updateControlPoint([x,y]);
  }

  renderImages() {
    const {imagery, controlpoints} = this.props;
    return imagery.items.map((item, idx) => {
      let klass = (imagery.selected === idx) ? 'selected' : '';
      if (imagery.selected === idx) {
        return <li key={item.file.name} className={klass} onClick={() => this.onImageSelect(idx)}>
          <span className='filename'>{item.file.name}</span>
          <ImagePanZoom image={imagery.items[imagery.selected].file} selectedImage={imagery.selected} onMouseUp={this.onImageMouseUp} points={controlpoints.points}/>
        </li>;
      }

      return <li key={item.file.name} className={klass} onClick={() => this.onImageSelect(idx)}>
        <span className='filename'>{item.file.name}</span>
      </li>;
    });
  }

  render() {
    const {imagery} = this.props;
    if (typeof imagery === 'undefined' || !imagery.items) return null;

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