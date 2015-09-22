import { handleActions } from 'redux-actions';
import { LIST_FILES, UPDATE_DB_REQUEST, UPDATE_FINISH, UPDATE_FINISH_ALL } from './actions';

export const reducer = handleActions({
  [LIST_FILES]: (state,  action) => {
    return Object.assign({}, state, {
      files: action.payload.files,
    });
  },
  [UPDATE_FINISH_ALL]: (state,  action) => {
    return Object.assign({}, state, {
      updating: false,
      updatingFiles: [],
      updatedFiles: [],
    });
  },
  [UPDATE_DB_REQUEST]: (state, action) => {
    return Object.assign({}, state, {
      updating: true,
      updatingFiles: action.payload.files
    });
  },
  [UPDATE_FINISH]: (state, action) => {
    return Object.assign({}, state, {
      updatedFiles: state.updatedFiles.concat(action.payload.finish)
    });
  },
}, {
  files: [],
  updating: false,
  updatingFiles: [],
  updatedFiles: [],
});