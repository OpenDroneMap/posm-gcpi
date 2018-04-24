import React, { Component } from 'react';

export default class FilePreview extends Component {
  render () {
    const { errors, previewGcpFileCancel, previewText, receiveGcpFile } = this.props;

    return (
      <div className='file-preview modal-dialog'>
        <div className='bk' onClick={previewGcpFileCancel}/>
        <div className='inner'>
          <div className='head'>
            <h3>Ground control point file preview</h3>
            <span className='icon' onClick={previewGcpFileCancel}><span>&times;</span></span>
          </div>
          <div className='output'>
            {errors && (
              <div className='errors'>
                {errors.map((error, i) => <p key={`error-${i}`}>{error}</p>)}
              </div>
            )}
            <textarea value={previewText} readOnly></textarea>
            <div className='actions'>
              <button onClick={previewGcpFileCancel}>Cancel</button>
              <button
                disabled={errors.length > 0}
                onClick={receiveGcpFile}
              >Load</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
