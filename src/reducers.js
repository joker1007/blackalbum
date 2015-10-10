import { Map as ImmutableMap, OrderedMap, List } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  LIST_FILES,
  UPDATE_DB_REQUEST,
  UPDATE_FINISH,
  UPDATE_FINISH_ALL,
  UPDATE_SEARCH_KEYWORD,
  SELECT_FILE,
  MULTI_SELECT_FILES,
  REMOVE_FILE,
  SET_SORT_ORDER,
  REGENERATE_THUMBNAIL,
  FAVORITE,
  FILENAME_ASC
} from './actions';

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
      selectedFiles: new ImmutableMap(),
      currentCursor: null,
      searchKeyword: keyword,
    });
  },
  [SELECT_FILE]: (state, action) => {
    const { file } = action.payload;
    return state.merge({
      selectedFiles: new ImmutableMap([[file.id, file]]),
      currentCursor: file,
    });
  },
  [MULTI_SELECT_FILES]: (state, action) => {
    const { files } = action.payload;
    return state.merge({
      selectedFiles: new ImmutableMap(files.map(f => [f.id, f])),
    });
  },
  [REMOVE_FILE]: (state, action) => {
    const { file } = action.payload;
    const files = state.get("files");
    const selectedFiles = state.get("selectedFiles");
    return state.merge({
      files: files.delete(file.id),
      selectedFiles: selectedFiles.delete(file.id),
      currentCursor: null,
    });
  },
  [SET_SORT_ORDER]: (state, action) => {
    const { sortOrder } = action.payload;
    return state.merge({
      selectedFiles: new ImmutableMap(),
      currentCursor: null,
      sortOrder: sortOrder,
    });
  },
  [REGENERATE_THUMBNAIL]: (state, action) => {
    const { selectedFiles } = action.payload;
    const newFiles = state.get("files").withMutations(_files => {
      selectedFiles.forEach(f => {
        _files.set(f.id, f);
      });
    });
    return state.merge({
      files: newFiles,
      selectedFiles: selectedFiles,
    });
  },
  [FAVORITE]: (state, action) => {
    const { selectedFiles } = action.payload;
    console.log(selectedFiles.toJS());
    const newFiles = state.get("files").withMutations(_files => {
      selectedFiles.forEach(f => {
        _files.set(f.id, f);
      });
    });
    return state.merge({
      files: newFiles,
      selectedFiles: selectedFiles,
    });
  },
}, new ImmutableMap({
  files: new OrderedMap(),
  updating: false,
  updatingFiles: new List(),
  updatedFiles: new List(),
  searchKeyword: "",
  selectedFiles: new ImmutableMap(),
  currentCursor: null,
  sortOrder: FILENAME_ASC,
}));
