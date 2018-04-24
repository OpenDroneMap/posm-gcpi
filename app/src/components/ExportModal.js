import classNames from 'classnames';
import React, { Component } from 'react';
import FileSaver from 'file-saver';
import L from 'leaflet';
import isEqual from 'lodash.isequal';
import uniqWith from 'lodash.uniqwith';
import { generateGcpOutput } from '../state/utils/controlpoints';
import { getUtmZoneFromLatLng, getProj4Utm } from '../common/coordinate-systems';

class ExportModal extends Component {
  constructor(props) {
    super(props);

    // detect if we can use FileSaver
    try {
        /*eslint-disable */
        this.isFileSaverSupported = !!new Blob;
        /*eslint-enable */
    } catch (e) {}

    this.state = {
      destinationProjection: '',
      exportText: '',
      error: null
    };
  }

  componentDidMount() {
    L.DomUtil.addClass(document.body, 'prevent-overflow');
    this.updateProps(this.props);
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
        alert('Sorry copy is not working, please use Ctrl/Cmd+C to copy');
      }
    }
  }

  saveText(evt) {
    evt.preventDefault();
    var blob = new Blob([this.txtarea.value], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, `gcp_file_${Date.now()}.txt`);
  }

  updateProps(props) {
    let destinationProjection = 'EPSG:4326';
    const { points, status } = props.controlpoints;
    const { sourceProjection } = props;

    if (sourceProjection === 'EPSG:4326') {
      let utmZones = points.filter(p => p.type === 'map')
        .map(p => getUtmZoneFromLatLng(p.coord[0], p.coord[1]));
      utmZones = uniqWith(utmZones, isEqual);
      if (utmZones.length === 1) {
        const { zone, hemisphere } = utmZones[0];
        destinationProjection = getProj4Utm(zone, hemisphere);
      }
    }
    else {
      destinationProjection = sourceProjection;
    }

    let error;
    if (!status.valid) {
      error = status.errors.map((err, index) => {
        return <p key={index} dangerouslySetInnerHTML={{ __html: err }} />
      });
    }

    const exportText = this.renderGcpOutput(destinationProjection);
    this.setState({ destinationProjection, error, exportText });
  }

  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }

  updateDestinationProjection(destinationProjection) {
    let exportText = '';
    let error;
    try {
      exportText = this.renderGcpOutput(destinationProjection);
    }
    catch (e) {
      error = <p>Invalid coordinate reference system. Please enter a valid <a href="http://proj4.org/">proj.4</a> string.</p>;
    }
    this.setState({ destinationProjection, error, exportText });
  }

  renderGcpOutput(destinationProjection) {
    const { controlpoints, projection } = this.props;
    let sourceProjection = projection ? projection : 'EPSG:4326';

    const rows = generateGcpOutput(controlpoints.joins, controlpoints.points, sourceProjection, destinationProjection);
    const proj = `${destinationProjection}\t`;
    rows.unshift(proj);
    return rows.join('\n');
  }

  render() {
    const { controlpoints } = this.props;
    const { status } = controlpoints;
    const { destinationProjection, error, exportText } = this.state;

    return (
      <div className={classNames('export-modal', 'modal-dialog', {
        'no-pts': !status.valid
      })}>
        <div className='bk' onClick={(evt) => {this.props.onClick(evt);} }/>
        <div className='inner'>
          <div className='head'>
            <h3>Ground control point file</h3>
            <span className='icon' onClick={(evt) => {this.props.onClick(evt);} }><span>&times;</span></span>
          </div>
          <div className='output'>
            {error &&
              <div className='errors'>{error}</div>
            }
            <div>
              <div>
                <input
                  className='destination-projection'
                  type="text"
                  value={destinationProjection}
                  onChange={(e) => this.updateDestinationProjection(e.target.value)}
                />
                <textarea ref={el => {this.txtarea = el;}} readOnly value={exportText}/>
              </div>
              <div className='actions'>
                <p>Copy text with <strong>Ctrl / Cmd+C</strong> or </p>
                <button onClick={e => {this.copyText(e);}} disabled={!status.valid}>Copy</button>
                { this.isFileSaverSupported &&
                <button onClick={e => {this.saveText(e);}} disabled={!status.valid}>Save</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExportModal;
