import React, { Component } from 'react';
import FileSaver from 'file-saver';
import L from 'leaflet';

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
    const {joins, points} = controlpoints;

    let txt = [];

    Object.keys(joins).forEach(k => {
      let mapPt = points.find(p => p.id === k);
      if (mapPt === undefined) return;

      let lat = mapPt.coord[0].toFixed(6);
      let lng = mapPt.coord[1].toFixed(6);

      joins[k].forEach(ptId => {
        let pt = points.find(p => p.id === ptId);
        if (pt === undefined) return;

        let name = pt.img_name;
        let x = pt.coord[0];
        let y = pt.coord[1];
        let z = pt.coord[2] || 0;
        txt.push( [lng, lat, z, x, y, name].join('\t') );
      });

    });

    if (!txt.length) return [0, 'Could not find a control points!'];

    let proj = (projection && projection.length) ? projection.join('\t') : 'EPSG:4326'; // Handle empty projection
    txt.unshift(proj);

    return [txt.length, txt.join('\n')];
  }

  render() {
    let [pointsLength, exportText] = this.renderText();
    let klass = (!pointsLength) ? ' no-pts' : '';

    return (
      <div className={`export-modal${klass}`}>
        <div className='bk' onClick={(evt) => {this.props.onClick(evt);} }/>
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
                    <textarea ref={el => {this.txtarea = el;}} readOnly value={exportText}/>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className='actions'>
              <p>Copy text with <strong>Ctrl / Cmd+C</strong> or </p>
              <button onClick={e => {this.copyText(e);}} disabled={!pointsLength}>Copy</button>
              { this.isFileSaverSupported &&
              <button onClick={e => {this.saveText(e);}} disabled={!pointsLength}>Save</button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExportModal;