export const ADD_CONTROL_POINT = 'ADD_CONTROL_POINT';
export function addControlPoint(imageIndex) {
  return {
    type: ADD_CONTROL_POINT,
    imageIndex
  }
}

export const UPDATE_CONTROL_POINT = 'UPDATE_CONTROL_POINT';
export function updateControlPoint(loc) {
  return {
    type: UPDATE_CONTROL_POINT,
    loc
  }
}

export const TOGGLE_CONTROL_POINT_MODE = 'TOGGLE_CONTROL_POINT_MODE';
export function toggleControlPointMode(location, imageIndex, pointIndex) {
  return {
    type: TOGGLE_CONTROL_POINT_MODE,
    imageIndex,
    pointIndex,
    location
  }
}

export const SELECT_IMAGE = 'SELECT_IMAGE';
export function selectImageFile(index) {
  return {
    type: SELECT_IMAGE,
    index
  }
}

export const RECEIVE_IMAGE_FILES = 'RECEIVE_IMAGE_FILES';
// Expects an array of File / Blob objects or strings
export function receiveImageFiles(files) {
  var isFileObjects = Object.prototype.toString.call(files[0]) === '[object File]' || Object.prototype.toString.call(files[0]) === '[object Blob]';

  let items = files.map((file)=>{
    return {file, points: initializePoints()};
  });

  return {
    type: RECEIVE_IMAGE_FILES,
    items,
    receivedAt: Date.now()
  }
}

function initializePoints() {
  return {
    points: [],
    addPoint: function(lat,lng) {
      this.points.push([lat,lng]);
    },
    updatePoint: function(idx, lat, lng) {
      if (!this.points[idx]) return new Error('Can not update point, index out of range');
      this.points[idx] = [lat,lng]
    },
    isValid: function() {
      return this.points.length === 3;
    }
  }
}