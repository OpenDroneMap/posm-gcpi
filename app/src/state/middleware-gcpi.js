/* GCPi middleware */
const gcpiMiddleware = store => next => action => {
  let st = store.getState();

  // act on these action types
  if (action.type === 'GCP_FILE_PROCESSED') {
    store.dispatch({
      type: 'SYNC_LIST_TO_IMAGES',
      images: st.imagery.items,
      list: action.rows
    });
  } else if (action.type === 'RECEIVE_IMAGE_FILES') {
    store.dispatch({
      type: 'SYNC_IMAGES_TO_POINTS',
      images: action.items
    });

    // close menu automatically?
    /*
    if (!st.imagery.items || !st.imagery.items.length) {
      store.dispatch({
        type: 'TOGGLE_MENU'
      });
    }
    */

  } else if (action.type === 'TOGGLE_MENU' && st.controlpoints.selected && !st.imagepanel.menu_active) {
    store.dispatch({
      type: 'TOGGLE_CONTROL_POINT_MODE',
      id: st.controlpoints.selected
    });
  } else if (action.type === 'TOGGLE_CONTROL_POINT_MODE' && st.imagepanel.menu_active) {
    if (st.imagery.items && st.imagery.items.length) {
      store.dispatch({
        type: 'TOGGLE_MENU'
      });
    }
  } else if (action.type === 'DELETE_IMAGE') {
    store.dispatch({
      type: 'ON_DELETE_IMAGE',
      img_name: action.name
    });
  }

  // resume to original action
  next(action);
};

export default gcpiMiddleware;