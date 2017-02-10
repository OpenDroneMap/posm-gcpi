export const ON_WINDOW_RESIZE = 'ON_WINDOW_RESIZE';
export function onWindowResize(size) {
  return {
    type: ON_WINDOW_RESIZE,
    size
  }
}

export const TOGGLE_EXPORT = 'TOGGLE_EXPORT';
export function toggleExport() {
  return {
    type: TOGGLE_EXPORT
  }
}

export const DELETE_CONTROL_POINT = 'DELETE_CONTROL_POINT';
export function deleteControlPoint(id) {
  return {
    type: DELETE_CONTROL_POINT,
    id
  }
}

export const TOGGLE_CONTROL_POINT_MODE = 'TOGGLE_CONTROL_POINT_MODE';
export function toggleControlPointMode(imageIndex, imageName, pointId, point=null) {
  return {
    type: TOGGLE_CONTROL_POINT_MODE,
    imageIndex,
    imageName,
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

  let now = Date.now();
  files.forEach((f,i) => {
    f.id = now + i;
  });

  return {
    type: RECEIVE_IMAGE_FILES,
    items: files,
    receivedAt: now
  }
}

export const RECEIVE_GCP_FILE = 'RECEIVE_GCP_FILE';
/*
coordinate system description
lng lat z1 pixelx1 pixely1 imagename1
...
*/
export function receiveGcpFile(file) {

  let now = Date.now();

  let delimiter = /\s|\t|,|\|/g;
  let newline = /\r|\n/g;

  let rows = file.split(newline).map(r => r.split(delimiter));
  let projection = [...rows[0]]

  rows = rows.filter(r => r.length === 6);
  rows = rows.map(r => {
    return r.map(d => {
      if (!isNaN(d)) {
        d = +d;
      }
      return d;
    });
  });

  return {
    type: RECEIVE_GCP_FILE,
    receivedAt: now,
    projection,
    rows
  }
}


