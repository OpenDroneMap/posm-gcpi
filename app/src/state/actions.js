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

export const TOGGLE_MENU = 'TOGGLE_MENU';
export function toggleMenu() {
  return {
    type: TOGGLE_MENU
  }
}

export const JOIN_CONTROL_POINT = 'JOIN_CONTROL_POINT';
export function joinControlPoint(id) {
  return {
    type: JOIN_CONTROL_POINT,
    id
  }
}

export const DELETE_CONTROL_POINT = 'DELETE_CONTROL_POINT';
export function deleteControlPoint(id) {
  return {
    type: DELETE_CONTROL_POINT,
    id
  }
}

export const AWAIT_CONTROL_POINT = 'AWAIT_CONTROL_POINT';
export function awaitControlPoint(image_loc) {
  return {
    type: AWAIT_CONTROL_POINT,
    image_loc
  }
}

export const ADD_CONTROL_POINT = 'ADD_CONTROL_POINT';
export function addControlPoint(coord, img_name, isImage) {
  let k = isImage ? 'img_coord' : 'map_coord';
  return {
    type: ADD_CONTROL_POINT,
    [k]: coord,
    img_name,
    isImage
  }
}

export const TOGGLE_CONTROL_POINT_MODE = 'TOGGLE_CONTROL_POINT_MODE';
export function toggleControlPointMode(id) {
  return {
    type: TOGGLE_CONTROL_POINT_MODE,
    id
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
export function deleteImageFile(name) {
  return {
    type: DELETE_IMAGE,
    name
  }
}

export const SELECT_IMAGE = 'SELECT_IMAGE';
export function selectImageFile(img_name) {
  return {
    type: SELECT_IMAGE,
    img_name
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
export function receiveGcpFile(file_name, file_content) {
  const now = Date.now();

  const delimiter = /\s|\t|,|\|/g;
  const newline = /\r|\n/g;

  let rows = file_content.split(newline).map(r => r.split(delimiter));
  let projection = rows.shift();

  rows = rows
    .filter(r => r.length)
    .map(r => {
      return r.map(d => {
        if (!isNaN(d)) {
          d = +d;
        }
        return d;
      });
  });

  const max_columns = rows.reduce((acc,item) => {
    return Math.max(acc, item.length);
  }, 0);

  return {
    type: RECEIVE_GCP_FILE,
    receivedAt: now,
    columns: [...Array(max_columns)].map((d,i) => i),
    projection,
    rows,
    file_name
  }
}

export const GCP_FILE_PROCESSED = 'GCP_FILE_PROCESSED';
export function gcpProcessed(filename, projection, rows) {
  return {
    type: GCP_FILE_PROCESSED,
    filename,
    projection,
    rows
  }
}


