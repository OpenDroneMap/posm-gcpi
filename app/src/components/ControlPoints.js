import React, { Component } from 'react';

class ControlPoints extends Component {

  renderPoints() {
    const { controlpoints, selectedImage } = this.props;
    const points = controlpoints.points.filter(p => {
      return p.img_name === selectedImage;
    });

    if (!points.length) return (
      <li>No points...</li>
    );

    return points.map((pt) => {
      let k = 'active point';
      if (pt.id === controlpoints.selected) k += ' edit';

      return (
        <li key={`gcp-tick-${pt.id}`} className={k}/>
      );
    });
  }

  render() {
    return (
      <div className='control-points-i'>
        <div>
          <h3>Ground Control Points</h3>
          <ul>
            {this.renderPoints()}
          </ul>
        </div>
      </div>
    );
  }
}

export default ControlPoints;
