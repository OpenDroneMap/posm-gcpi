import React, { Component } from 'react';
import Header from './Header';
import Directions from './Directions';
import ControlPoints from './ControlPoints';
import ExportButton from './ExportButton';
import LeafletMap from '../connectors/LeafletMap';


class App extends Component {
  render() {
    return (
      <div className='app'>
        <Header />
        <main className='main'>
          <section className='inner'>
            <div className='panel left'>
              <Directions/>
              <ControlPoints {...this.props}/>
              <ExportButton onClick={()=>{console.log('click');}}/>
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
