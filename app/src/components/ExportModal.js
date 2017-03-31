import React, { Component } from 'react';
import FileSaver from 'file-saver';
import L from 'leaflet';
import {generateGcpOutput} from '../state/utils/controlpoints';

class ExportModal extends Component {

  constructor(props) {
    super(props);

    // detect if we can use FileSaver
    try {
        /*eslint-disable */
        this.isFileSaverSupported = !!new Blob;
        /*eslint-enable */
    } catch (e) {}

  }

  componentDidMount() {
    L.DomUtil.addClass(document.body, 'prevent-overflow');
  }

  componentWillUnmount() {
    L.DomUtil.removeClass(document.body, 'prevent-overflow');
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
    const {controlpoints, projection} = this.props;
    const {joins, points, status} = controlpoints;

    if (!status.valid) {
      return status.errors.map(err => {
        return <p dangerouslySetInnerHTML={{ __html: err }} />
      });
    }

    let rows = generateGcpOutput(joins, points);

    let proj = (projection && projection.length) ? projection.join('\t') : 'EPSG:4326'; // Handle empty projection
    rows.unshift(proj);

    return rows.join('\n');
  }

  render() {
    const {controlpoints} = this.props;
    const {status} = controlpoints;

    let exportText = this.renderText();
    let klass = (!status.valid) ? ' no-pts' : '';

    return (
      <div className={`export-modal${klass}`}>
        <div className='bk' onClick={(evt) => {this.props.onClick(evt);} }/>
        <div className='inner'>
          <div className='head'>
            <h3>Ground control point file</h3>
            <span className='icon' onClick={(evt) => {this.props.onClick(evt);} }><span>&times;</span></span>
          </div>
          <div className='output'>
            {status.valid &&
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <p>Here is your text</p>
                      </td>
                      <td>
                        <textarea ref={el => {this.txtarea = el;}} readOnly value={exportText}/>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className='actions'>
                  <p>Copy text with <strong>Ctrl / Cmd+C</strong> or </p>
                  <button onClick={e => {this.copyText(e);}} disabled={!status.valid}>Copy</button>
                  { this.isFileSaverSupported &&
                  <button onClick={e => {this.saveText(e);}} disabled={!status.valid}>Save</button>
                  }
                </div>
              </div>
            }
            {!status.valid &&
              <div className='errors'>
                {exportText}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default ExportModal;