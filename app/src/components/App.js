import React, { Component } from 'react';
import Header from './Header';
import LeafletMap from '../connectors/LeafletMap';


class App extends Component {
  render() {
    return (
      <div className='app'>
        <Header />
        <main className='main'>
          <LeafletMap />
        </main>
      </div>
    );
  }
}

export default App;
