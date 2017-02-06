export const DELETE_CONTROL_POINT = 'DELETE_CONTROL_POINT';
export function deleteControlPoint(id) {
  return {
    type: DELETE_CONTROL_POINT,
    id
  }
}

export const TOGGLE_CONTROL_POINT_MODE = 'TOGGLE_CONTROL_POINT_MODE';
export function toggleControlPointMode(imageIndex, pointId, point=null) {
  return {
    type: TOGGLE_CONTROL_POINT_MODE,
    imageIndex,
    pointId,
    point
  }
}

export const SET_CONTROL_POINT_POSITION = 'SET_CONTROL_POINT_POSITION';
export function setControlPointPosition(loc, id, pos) {
  return {
    type: SET_CONTROL_POINT_POSITION,
    loc,
    id,
    pos
  }
}



export const DELETE_IMAGE = 'DELETE_IMAGE';
export function deleteImageFile(id) {
  return {
    type: DELETE_IMAGE,
    id
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
  // var isFileObjects = Object.prototype.toString.call(files[0]) === '[object File]' || Object.prototype.toString.call(files[0]) === '[object Blob]';

  let now = +new Date();
  files.forEach((f,i) => {
    f.id = now + i;
  });

  return {
    type: RECEIVE_IMAGE_FILES,
    items: files,
    receivedAt: now
  }
}
