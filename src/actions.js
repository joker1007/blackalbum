import { createAction } from 'redux-actions';

export const LIST_FILES = 'LIST_FILES';

export let listFiles = createAction(LIST_FILES, async () => {
  let files = await global.db.files.toArray();
  return { files };
});
