import React, { Component, PropTypes } from 'react';

class RangeSlider extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number
  }

  static defaultProps = {
    onChange: () => {},
    min: 0,
    max: 1,
    step: 0.01,
    value: 1
  }

  render() {
    return (
      <input type='range' className='input-range' value={this.props.value} min={this.props.min} max={this.props.max} step={this.props.step} onChange={this.props.onChange}/>
    );
  }
}

export default RangeSlider;