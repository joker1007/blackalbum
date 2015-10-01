import { OrderedMap, List } from 'immutable';
import { createAction } from 'redux-actions';
import _ from 'lodash';
import denodeify from 'denodeify';
import _glob from 'glob';
import MediaFile from './media_file.js';
import PromisePool from 'es6-promise-pool';

let fs = global.require('fs');
let path = global.require('path');
let glob = denodeify(_glob);

/*
 * Action Names
 */
export const LIST_FILES = 'LIST_FILES';
export const UPDATE_DB_REQUEST = 'UPDATE_DB_REQUEST';
export const UPDATE_FINISH_ALL = 'UPDATE_FINISH_ALL';
export const UPDATE_FINISH = 'UPDATE_FINISH';
export const UPDATE_SEARCH_KEYWORD = 'UPDATE_SEARCH_KEYWORD';
export const SELECT_FILE = 'SELECT_FILE';
export const SELECT_RANGE_FILES = 'SELECT_RANGE_FILES';
export const SELECT_MULTI_FILES = 'SELECT_MULTI_FILES';
export const REMOVE_FILE = 'REMOVE_FILE';
export const SET_SORT_ORDER = 'SET_SORT_ORDER';

/*
 * Sort Order Names
 */
export const FILENAME_ASC  = 'FILENAME_ASC';
export const FILENAME_DESC = 'FILENAME_DESC';
export const FILESIZE_ASC  = 'FILESIZE_ASC';
export const FILESIZE_DESC = 'FILESIZE_DESC';
export const CTIME_ASC     = 'CTIME_ASC';
export const CTIME_DESC    = 'CTIME_DESC';


export let listFiles = createAction(LIST_FILES, async () => {
  const files = await global.db.files.orderBy('basename').toArray();
  const data = _.map(files, f => {
    return [f.id, MediaFile.build(f)];
  });
  const mediaFiles = new OrderedMap(data);
  return { files: mediaFiles };
});

export let requestUpdateDb = createAction(UPDATE_DB_REQUEST, async () => {
  let files = new List();
  for (let dir of global.config.targetDirectories) {
    let globbed = await glob(path.join(dir, "**", `*.{${global.config.targetExtensions.join(",")}}`));
    for (let f of globbed) {
      let valid = _.all(global.config.filterWords, w => {
        return !f.normalize().match(w)
      })
      if (valid) {
        files = files.push(f);
      }
    }
  }
  return { files };
});

export let finishUpdate = createAction(UPDATE_FINISH, (file) => {
  return {
    finish: file
  };
});

export let finishAllUpdate = createAction(UPDATE_FINISH_ALL, () => {
  return {};
});

export let selectFile = createAction(SELECT_FILE, (file) => {
  return { file }
});

export let removeFile = createAction(REMOVE_FILE, async (file) => {
  await global.db.files.delete(file.id)
  return { file }
});

export let setSortOrder = createAction(SET_SORT_ORDER, sortOrder => {
  return { sortOrder };
});

export let updateSearchKeyword = createAction(UPDATE_SEARCH_KEYWORD, keyword => {
  return { keyword };
});

export function updateDb(targetFiles) {
  return async dispatch => {
    const promiseProducer = function * () {
      for (let f of targetFiles) {
        yield addFile(f);
        dispatch(finishUpdate(f))
      }
    }
    const pool = new PromisePool(promiseProducer, 4)
    await pool.start();
    dispatch(finishAllUpdate());
    dispatch(listFiles());
  };
}

async function addFile(f) {
  try {
    let mediaFile = await MediaFile.buildByFileAsync(f);
    let isPersisted = await mediaFile.isPersistedAsync();
    if (!isPersisted) {
      let dbData = await mediaFile.toDbData();
      global.db.files.add(dbData);
    }
    let { count, size } = global.config.thumbnail;
    return mediaFile.createThumbnail({ count, size });
  } catch (err) {
    console.warn(f, err);
  }
}
