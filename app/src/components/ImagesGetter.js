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
    const {receiveImageFiles} = this.props;
    this.images = acceptedFiles;
    receiveImageFiles(this.images, this.gcpText);
  }

  onTextDrop(acceptedFiles, rejectedFiles) {
    const {receiveGcpFile} = this.props;
    let fReader = new FileReader();
    fReader.readAsText(acceptedFiles[0]);
    fReader.onload = () => {
      receiveGcpFile(fReader.result)
    };
  }

  submitLocalFiles(evt) {
    evt.preventDefault();

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
        <aside className='images-form'>

          <div className='dropzone-wrapper'>
            <Dropzone
              className='dropzone'
              disablePreview={true}
              onDrop={this.onTextDrop}
              activeStyle={{borderStyle: 'solid', backgroundColor: '#eee'}}
              rejectStyle={{borderStyle: 'solid', backgroundColor: '#ffdddd'}}>
              <div>Load existing Control Point File</div>
            </Dropzone>
          </div>
          <div className='dropzone-wrapper'>
            <Dropzone
              className='dropzone'
              disablePreview={true}
              onDrop={this.onImagesDrop}
              activeStyle={{borderStyle: 'solid', backgroundColor: '#eee'}}
              rejectStyle={{borderStyle: 'solid', backgroundColor: '#ffdddd'}}>
              <div><b>Choose images</b> / drag here</div>
            </Dropzone>
          </div>
        </aside>

      </div>
    );
  }
}

export default ImagesGetter;