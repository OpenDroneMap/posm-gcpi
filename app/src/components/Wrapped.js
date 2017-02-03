import React, { Component } from 'react';

function WrappedApp(WrappedComponent) {
  return class extends Component {

      constructor(props) {
        super(props);

        this.onMapPositionChange = this.onMapPositionChange.bind(this);
        this.onImagePositionChange = this.onImagePositionChange.bind(this);
        this.getPositions = this.getPositions.bind(this);

        this._mapPosition = [0,0];
        this._imagePosition = [0,0];
      }

      onMapPositionChange(loc) {
        this._mapPosition = loc;
      }

      onImagePositionChange(loc) {
        this._imagePosition = loc;
      }

      getPositions() {
        return {
          map: this._mapPosition,
          image: this._imagePosition
        }
      }

      render() {
        return <WrappedComponent
          getPositions={this.getPositions}
          onImagePositionChange={this.onImagePositionChange}
          onMapPositionChange={this.onMapPositionChange} {...this.props}/>
      }
    }
}

export default WrappedApp;