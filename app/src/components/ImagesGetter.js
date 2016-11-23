import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

class ImagesGetter extends Component {
  constructor(props) {
    super(props);
    this.onImagesDrop = this.onImagesDrop.bind(this);
    this.onTextDrop = this.onTextDrop.bind(this);
    this.submitLocalFiles = this.submitLocalFiles.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  onImagesDrop(acceptedFiles, rejectedFiles) {
    this.images = acceptedFiles;
  }

  onTextDrop(acceptedFiles, rejectedFiles) {
    let fReader = new FileReader();
    fReader.readAsText(acceptedFiles[0]);
    fReader.onload = () => {
      let rows = fReader.result.split('\n');
      this.gcpText = rows;
    };
  }

  submitLocalFiles(evt) {
    evt.preventDefault();

    this.refs.toggler.checked = false;
    const {receiveImageFiles} = this.props;
    receiveImageFiles(this.images, this.gcpText);
  }

  onToggle() {
    this.gcpText = null;
    this.images = null;
  }

  render() {
    return (
      <div className='images-getter'>
        <input ref='toggler' id='images-getter-toggle' type='checkbox'/>
        <label htmlFor='images-getter-toggle' onClick={this.onToggle}><h3>Images</h3> <span>+</span></label>
        <aside className='images-form'>
          <h3>Local</h3>
          <h4>GCP text file</h4>
          <div className='dropzone-wrapper'>
            <Dropzone
              className='dropzone'
              disablePreview={true}
              onDrop={this.onTextDrop}
              activeStyle={{borderStyle: 'solid', backgroundColor: '#eee'}}
              rejectStyle={{borderStyle: 'solid', backgroundColor: '#ffdddd'}}>
              <div><b>Choose file</b> or drag here.</div>
            </Dropzone>
          </div>
          <h4>Images</h4>
          <div className='dropzone-wrapper'>
            <Dropzone
              className='dropzone'
              disablePreview={true}
              onDrop={this.onImagesDrop}
              activeStyle={{borderStyle: 'solid', backgroundColor: '#eee'}}
              rejectStyle={{borderStyle: 'solid', backgroundColor: '#ffdddd'}}>
              <div><b>Choose files</b> or drag them here.</div>
            </Dropzone>
          </div>
          <div className='clearfix'>
            <button className='btn btn-primary right' onClick={this.submitLocalFiles}>GO</button>
          </div>

          <h3>Remote Files</h3>
          <p className='orange' style={{margin:0, padding: 0}}>Coming soon...</p>
        </aside>

      </div>
    );
  }
}

export default ImagesGetter;