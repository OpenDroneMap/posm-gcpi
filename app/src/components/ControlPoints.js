import React, { Component } from 'react';
import ImagesGetter from '../connectors/ImagesGetter';
import Images from '../connectors/Images';

class ControlPoints extends Component {
  render() {
    return (
      <div className='control-points-i'>
        <div className='overview'>
          <div>
            <h3>Ground Control Points</h3>
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
        <ImagesGetter/>
        <Images {...this.props}/>
      </div>
    );
  }
}

export default ControlPoints;