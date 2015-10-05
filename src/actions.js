/* @flow */

import { OrderedMap, List } from 'immutable';
import { createAction } from 'redux-actions';
import _ from 'lodash';
import denodeify from 'denodeify';
import MediaFile from './media_file.js';
import PromisePool from 'es6-promise-pool';

/*
 * Action Names
 */
export const LIST_FILES = 'LIST_FILES';
export const UPDATE_DB_REQUEST = 'UPDATE_DB_REQUEST';
export const UPDATE_FINISH_ALL = 'UPDATE_FINISH_ALL';
export const UPDATE_FINISH = 'UPDATE_FINISH';
export const UPDATE_SEARCH_KEYWORD = 'UPDATE_SEARCH_KEYWORD';
export const SELECT_FILE = 'SELECT_FILE';
export const MULTI_SELECT_FILES = 'MULTI_SELECT_FILES';
export const SELECT_RANGE_FILES = 'SELECT_RANGE_FILES';
export const SELECT_MULTI_FILES = 'SELECT_MULTI_FILES';
export const REMOVE_FILE = 'REMOVE_FILE';
export const SET_SORT_ORDER = 'SET_SORT_ORDER';
export const REGENERATE_THUMBNAIL = 'REGENERATE_THUMBNAIL';

/*
 * Sort Order Names
 */
export const FILENAME_ASC  = 'FILENAME_ASC';
export const FILENAME_DESC = 'FILENAME_DESC';
export const FULLPATH_ASC  = 'FULLPATH_ASC';
export const FULLPATH_DESC = 'FULLPATH_DESC';
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
  const existFiles = await existFilesMap();
  const files = (await global.config.getTargetFiles()).filterNot(f => existFiles.has(f));
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
  return { file };
});

export let multiSelectFiles = createAction(MULTI_SELECT_FILES, (files) => {
  return { files };
});

export let removeFile = createAction(REMOVE_FILE, async (file) => {
  await global.db.files.delete(file.id);
  return { file };
});

export let setSortOrder = createAction(SET_SORT_ORDER, sortOrder => {
  return { sortOrder };
});

export let updateSearchKeyword = createAction(UPDATE_SEARCH_KEYWORD, keyword => {
  return { keyword };
});

export let regenerateThumbnail = createAction(REGENERATE_THUMBNAIL, async selectedFiles => {
  let promises = [];
  let { count, size } = global.config.thumbnail;
  selectedFiles.forEach(f => {
    promises.push(f.createThumbnail({ count, size }, true));
  });
  await Promise.all(promises);
  return { selectedFiles };
});

export function updateDb(targetFiles: List<string>): Function {
  return async dispatch => {
    const promiseProducer = function * () {
      for (let f of targetFiles) {
        yield addFile(f);
        dispatch(finishUpdate(f))
      }
    }
    const pool = new PromisePool(promiseProducer, 4)
    try {
      await pool.start();
    } catch (err) {
      console.warn(err);
    } finally {
      dispatch(finishAllUpdate());
      dispatch(listFiles());
    }
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

async function existFilesMap() {
  const map = new Map();
  const fromDb = await global.db.files.toArray();
  for (let f of fromDb) {
    map.set(f.fullpath, true);
  }
  return map;
}
