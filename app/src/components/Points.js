import React, { Component } from 'react';

class Points extends Component {

  pointClass(location, point) {
    return (point.location === location && point.active) ? 'active' : '';
  }

  renderPoints() {
    const {points, toggleControlPointMode} = this.props;
    if (!points) return null;

    return points.map((point, idx) => {
      return (
          <div key={`pt-${idx}`}>
            <div className={`table-cell point ${this.pointClass('image', point, idx)}`}>
              <button className='btn' onClick={() => toggleControlPointMode('image', point.imageIndex, point.pointIndex)}/>
            </div>
            <div className={`table-cell point ${this.pointClass('map', point, idx)}`}>
              <button className='btn' onClick={() => toggleControlPointMode('map', point.imageIndex, point.pointIndex)}/>
            </div>
          </div>
        );
    });
  }

  render() {
    const {addControlPoint, fileIndex} = this.props;
    return (
      <div className='control-points'>
        <div className='table'>
          <div className='controls'>
            <div className='table-cell'>
              <button className='add btn' onClick={() => addControlPoint(fileIndex)}>+</button>
            </div>
            <div className='table-cell'>
              <button className='remove btn' onClick={() => addControlPoint(fileIndex)}>&mdash;</button>
            </div>
          </div>
          {this.renderPoints()}
        </div>
      </div>
    );
  }
}

export default Points;