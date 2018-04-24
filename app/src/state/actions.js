import proj4 from 'proj4';
import { isProjectionString } from '../common/coordinate-systems';
import { getProj4Utm, parseUtmDescriptor } from '../common/coordinate-systems';

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

export const LOCK_CONTROL_POINT = 'LOCK_CONTROL_POINT';
export function lockControlPoint(id) {
  return {
    type: LOCK_CONTROL_POINT,
    id
  }
}

export const HIGHLIGHT_CONTROL_POINT = 'HIGHLIGHT_CONTROL_POINT';
export function highlightControlPoint(id) {
  return {
    type: HIGHLIGHT_CONTROL_POINT,
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
export function addControlPoint(coord, img_name, isImage, isAutomatic=false) {
  let k = isImage ? 'img_coord' : 'map_coord';
  return {
    type: ADD_CONTROL_POINT,
    [k]: coord,
    img_name,
    isAutomatic,
    isImage
  }
}

export const ADD_AUTOMATIC_CONTROL_POINT = 'ADD_AUTOMATIC_CONTROL_POINT';
export function addAutomaticControlPoint(coord, img_name, isImage) {
  return addControlPoint(coord, img_name, isImage, true);
}

export const CLEAR_AUTOMATIC_CONTROL_POINTS = 'CLEAR_AUTOMATIC_CONTROL_POINTS';
export function clearAutomaticControlPoints() {
  return {
    type: CLEAR_AUTOMATIC_CONTROL_POINTS
  };
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

export const PREVIEW_GCP_FILE = 'PREVIEW_GCP_FILE';

export function previewGcpFile(name, content) {
  let newline = /\r|\n/g;
  let delimiter = /\s|\t|,|\|/g;

  let lines = content.split(newline);
  let rows = lines;
  let sourceProjection;

  const errors = [];

  if (isProjectionString(lines[0])) {
    sourceProjection = lines[0].trim();
    rows = lines.slice(1);

    if (sourceProjection) {
      let utmProjection = parseUtmDescriptor(sourceProjection);
      if (utmProjection) {
        sourceProjection = getProj4Utm(utmProjection.zone, utmProjection.hemisphere);
      }
    }
  }
  rows = rows
    .map(r => r.split(delimiter))
    .map(r => r.map(d => !isNaN(d) ? +d : d));

  try {
    proj4(sourceProjection, 'EPSG:4326', [0, 0]);
  }
  catch (e) {
    errors.push(`Unknown projection ${sourceProjection}, please use a proj.4 string or UTM (for example, "WGS84 UTM 11N") to define the projection.`);
  }

  return {
    type: PREVIEW_GCP_FILE,
    file_name: name,
    gcp_list_text: content,
    errors,
    rows,
    sourceProjection
  };
}

export const PREVIEW_GCP_FILE_CANCEL = 'PREVIEW_GCP_FILE_CANCEL';

export function previewGcpFileCancel() {
  return {
    type: PREVIEW_GCP_FILE_CANCEL
  };
}


export const RECEIVE_GCP_FILE = 'RECEIVE_GCP_FILE';

export function receiveGcpFile() {
  return {
    type: RECEIVE_GCP_FILE,
    receivedAt: Date.now(),
    projection: 'EPSG:4326'
  };
}
