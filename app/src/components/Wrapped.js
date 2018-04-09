import React, { Component } from 'react';

function WrappedApp(WrappedComponent) {
  return class extends Component {

      constructor(props) {
        super(props);

        this.onMapPositionChange = this.onMapPositionChange.bind(this);
        this.onImagePositionChange = this.onImagePositionChange.bind(this);
        this.getPositions = this.getPositions.bind(this);
        this.setPointProperties = this.setPointProperties.bind(this);

        this._mapPosition = [0,0];
        this._imagePosition = [0,0];
        this.resetPointProperties();
      }

      componentWillReceiveProps(np) {
        if (np.mode !== this.props.mode) {
          this.resetPointProperties();
        }
      }

      resetPointProperties() {
        this._pointProperties = {
          img: null,
          img_id: null,
          img_loc: null,
          map_loc: null,
          map_id: null
        }
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

      setPointProperties(fromImage, img, img_id, img_loc, map_id, map_loc) {
        if (fromImage) {
          this._pointProperties.img = img;
          this._pointProperties.img_id = img_id;
          this._pointProperties.img_loc = img_loc;
        } else {
          this._pointProperties.map_id = map_id;
          this._pointProperties.map_loc = map_loc;
        }
      }

      render() {
        return <WrappedComponent
          setPointProperties={this.setPointProperties}
          getPositions={this.getPositions}
          onImagePositionChange={this.onImagePositionChange}
          onMapPositionChange={this.onMapPositionChange} {...this.props}/>
      }
    }
}

export default WrappedApp;
