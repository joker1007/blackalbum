import { Map, OrderedMap, List } from 'immutable';
import { handleActions } from 'redux-actions';
import { LIST_FILES, UPDATE_DB_REQUEST, UPDATE_FINISH, UPDATE_FINISH_ALL, UPDATE_SEARCH_KEYWORD, SELECT_FILE, REMOVE_FILE, SET_SORT_ORDER, FILENAME_ASC } from './actions';

export const reducer = handleActions({
  [LIST_FILES]: (state,  action) => {
    return state.merge({
      files: action.payload.files
    });
  },
  [UPDATE_FINISH_ALL]: (state,  action) => {
    return state.merge({
      updating: false,
      updatingFiles: new List(),
      updatedFiles: new List(),
    });
  },
  [UPDATE_DB_REQUEST]: (state, action) => {
    return state.merge({
      updating: true,
      updatingFiles: action.payload.files
    });
  },
  [UPDATE_FINISH]: (state, action) => {
    const updatedFiles = state.get("updatedFiles");
    return state.merge({
      updatedFiles: updatedFiles.push(action.payload.finish)
    });
  },
  [UPDATE_SEARCH_KEYWORD]: (state, action) => {
    const { keyword } = action.payload;
    return state.merge({
      searchKeyword: keyword,
    });
  },
  [SELECT_FILE]: (state, action) => {
    const { file } = action.payload;
    return state.merge({
      selectedFiles: new OrderedMap({
        [file.id]: file,
      })
    });
  },
  [REMOVE_FILE]: (state, action) => {
    const { file } = action.payload;
    const files = state.get("files");
    const selectedFiles = state.get("selectedFiles");
    return state.merge({
      files: files.delete(file.id),
      selectedFiles: selectedFiles.delete(file.id),
    });
  },
  [SET_SORT_ORDER]: (state, action) => {
    const { sortOrder } = action.payload;
    return state.merge({
      sortOrder: sortOrder
    });
  }
}, new Map({
  files: new OrderedMap(),
  updating: false,
  updatingFiles: new List(),
  updatedFiles: new List(),
  searchKeyword: "",
  selectedFiles: new OrderedMap(),
  sortOrder: FILENAME_ASC,
}));
