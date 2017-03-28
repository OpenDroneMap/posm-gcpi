import React, { Component, PropTypes } from 'react';

class SlidingPanel extends Component {
  static propTypes = {
    panelOpen: PropTypes.bool.isRequired
  }

  static defaultProps = {
    panelOpen: false
  }

  panelClass() {
    const {panelOpen} = this.props;
    let klass = 'sliding-panel';

    if (!panelOpen) return klass;

    return klass + ' open';
  }

  render() {
    const {height} = this.props;
    return (
      <div className={this.panelClass()} style={{height: height}}>
        {this.props.children}
      </div>
    );
  }
}

export default SlidingPanel;