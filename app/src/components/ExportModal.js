import React, { Component } from 'react';
import FileSaver from 'file-saver';

class ExportModal extends Component {

  constructor(props) {
    super(props);

    // detect if we can use FileSaver
    try {
        this.isFileSaverSupported = !!new Blob;
    } catch (e) {}

  }

  copyText(evt) {
    evt.preventDefault();
    if (this.txtarea && this.txtarea.select) {
      this.txtarea.select();
      try {
        document.execCommand('copy');
        this.txtarea.blur();
      }
      catch (err) {
        alert('sorry not working, please use Ctrl/Cmd+C to copy');
      }
    }
  }

  saveText(evt) {
    evt.preventDefault();
    var blob = new Blob([this.txtarea.value], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, `gcp_file_${Date.now()}.txt`);
  }

  renderText() {
    const {controlpoints} = this.props;
    // EPSG:4326
    // 16.63593223 52.77337048 70 691 3498 img_4851.jpg
    // lng lat z1 pixelx1 pixely1 imagename1
    let txt = [];
    controlpoints.points.map(pt => {
      let name = pt.imageName;
      let locs = pt.locations;
      if (!locs.map.length === 2 || !locs.image.length === 2) return;
      let lat = locs.map[0];
      let lng = locs.map[1];
      let z = locs.z || 0;
      let x = locs.image[0];
      let y = locs.image[1];

      let row = [lng, lat, z, x, y, name].join('\t');
      txt.push(row);
    });

    if (!txt.length) return 'Need control points!';

    txt.unshift('EPSG:4326');

    return txt.join('\n');
  }

  render() {
    return (
      <div className='export-modal'>
        <div className='inner'>
          <div className='head'>
            <h3>Ground control point file</h3>
            <span className='icon' onClick={(evt) => {this.props.onClick(evt);} }><span>&times;</span></span>
          </div>
          <div className='output'>
            <table>
              <tbody>
                <tr>
                  <td>
                    <p>Here is your text</p>
                  </td>
                  <td>
                    <textarea ref={el => {this.txtarea = el;}} readOnly value={this.renderText()}/>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className='actions'>
              <p>Copy text with <strong>Ctrl / Cmd+C</strong> or </p>
              <button onClick={e => {this.copyText(e);}}>Copy</button>
              { this.isFileSaverSupported &&
              <button onClick={e => {this.saveText(e);}}>Save</button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExportModal;