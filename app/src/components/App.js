import React, { Component } from 'react';
import { WindowResizeListener } from 'react-window-resize-listener'
import Header from './Header';
import Directions from './Directions';
import ControlPoints from '../connectors/ControlPoints';
import ExportButton from './ExportButton';
import LeafletMap from '../connectors/LeafletMap';
import ExportModal from './ExportModal';


class App extends Component {

  constructor(props) {
    super(props);
    WindowResizeListener.DEBOUNCE_TIME = 200;
  }

  componentDidMount() {
  }

  onResize(w) {
    this.props.onWindowResize(w);
  }

  getControlPointsHeight() {
    if (!this.innerLeftPanel) return 'auto';

    let panelHeight = this.innerLeftPanel.parentNode.offsetHeight;
    return `${panelHeight - 48 - 72}px`;

    // 48px = direction height
    // 72px = export button height
  }

  getLeftPanelHeight() {
    if (!this.innerLeftPanel) return 'auto';

    this.innerLeftPanel.style.height = '1px';

    let panelHeight = this.innerLeftPanel.parentNode.offsetHeight;
    return `${panelHeight}px`;
  }

  onExportClick(evt) {
    evt.preventDefault();
    this.props.toggleExport();
  }

  render() {
    const {exporter, controlpoints, imagery} = this.props;
    let controlPointsHeight = this.getControlPointsHeight();
    let panelHeight = this.getLeftPanelHeight();

    return (
      <div className='app'>
        <WindowResizeListener onResize={(w) => {this.onResize(w);}} />
        {exporter.active &&
          <ExportModal
            projection={imagery.projection}
            controlpoints={controlpoints}
            onClick={(evt)=>{this.onExportClick(evt);}}/>
        }
        <Header />
        <main className='main'>
          <section className='inner'>
            <div className='panel left'>
              <div ref={(el) => {this.innerLeftPanel = el;}} style={{height: panelHeight}}>
                <Directions/>
                <ControlPoints {...this.props} height={controlPointsHeight}/>
                <ExportButton onClick={(evt)=>{this.onExportClick(evt);}}/>
              </div>
            </div>
            <div className='panel right'>
              <LeafletMap {...this.props}/>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
