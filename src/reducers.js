import { handleActions } from 'redux-actions';
import { LIST_FILES } from './actions';

export const reducer = handleActions({
  [LIST_FILES]: (state,  action) => {
    return {
      files: action.payload.files
    };
  }
});
