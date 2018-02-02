import React, { Component } from 'react';

class Directions extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.onClick = this.onClick.bind(this);
  }

  onClick(evt) {
    evt.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const statusClass = this.state.isOpen ? '' : 'hidden';
    return (
      <div className={`directions ${statusClass}`}>
        <h3 onClick={this.onClick}><span className='arrow'></span>Directions</h3>
        <div className='direction-content'>
          <p>Connect at least 5 high-contrast objects in 3 or more photos to their corresponding locations on the map.</p>
          <ol>
            <li>
              <span className='tc'><span className='circled'>1</span></span>
              <span className='tc'>Upload images (jpeg or png).</span></li>
            <li>
              <span className='tc'><span className='circled'>2</span></span>
              <span className='tc'>Set a point in an image.</span>
            </li>
            <li>
              <span className='tc'><span className='circled'>3</span></span>
              <span className='tc'>Set a corresponding point on the map.</span>
            </li>
            <li>
              <span className='tc'><span className='circled'>4</span></span>
              <span className='tc'>Repeat as desired (at least until the goal is achieved).</span>
            </li>
            <li>
              <span className='tc'><span className='circled'>5</span></span>
              <span className='tc'>Generate the ground control point file.</span>
            </li>
          </ol>
        </div>
      </div>
    );
  }
}

export default Directions;