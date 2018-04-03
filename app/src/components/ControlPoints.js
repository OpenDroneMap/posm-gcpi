import React, { Component } from 'react';
import classNames from 'classnames';

class ControlPoints extends Component {

  renderPoints() {
    const { controlpoints, selectedImage } = this.props;
    const points = controlpoints.points.filter(p => {
      return p.img_name === selectedImage;
    });

    if (!points.length) return (
      <li>No points...</li>
    );

    return points.map((pt) => (
      <li key={`gcp-tick-${pt.id}`} className={classNames(
        'active', 'point', { 'edit': pt.isAutomatic }
      )}/>
    ));
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
