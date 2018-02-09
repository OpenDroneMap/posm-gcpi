import React, { Component } from 'react';

export default class FilePreview extends Component {
  render () {
    const { filename, previewGcpFileCancel, previewText, receiveGcpFile } = this.props;

    return (
      <div className='file-preview modal-dialog'>
        <div className='bk' onClick={previewGcpFileCancel}/>
        <div className='inner'>
          <div className='head'>
            <h3>Ground control point file preview</h3>
            <span className='icon' onClick={previewGcpFileCancel}><span>&times;</span></span>
          </div>
          <div className='output'>
            <textarea value={previewText} readOnly></textarea>
            <div className='actions'>
              <button onClick={previewGcpFileCancel}>Cancel</button>
              <button onClick={() => receiveGcpFile(filename, previewText)}>Load</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
