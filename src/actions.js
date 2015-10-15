/* @flow */

import { Map as ImmutableMap, OrderedMap, List } from 'immutable';
import { createAction } from 'redux-actions';
import _ from 'lodash';
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
export const FAVORITE = 'FAVORITE';
export const SAVE_SEARCH_PRESET = 'SAVE_SEARCH_PRESET';
export const DELETE_SEARCH_PRESET = 'DELETE_SEARCH_PRESET';
export const SET_CURRENT_CURSOR_OFFSET = 'SET_CURRENT_CURSOR_OFFSET';

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


export const listFiles = createAction(LIST_FILES, async () => {
  const files = await global.db.files.orderBy('basename').toArray();
  const data = _.map(files, f => {
    return [f.id, MediaFile.build(f)];
  });
  const mediaFiles = new OrderedMap(data);
  return { files: mediaFiles };
});

export const requestUpdateDb = createAction(UPDATE_DB_REQUEST, async () => {
  const existFiles = await existFilesMap();
  const files = (await global.config.getTargetFiles()).filterNot(f => existFiles.has(f));
  return { files };
});

export const finishUpdate = createAction(UPDATE_FINISH, (file) => {
  return { file };
});

export const finishAllUpdate = createAction(UPDATE_FINISH_ALL, () => {
  return {};
});

export const selectFile = createAction(SELECT_FILE, (file) => {
  return { file };
});

export const multiSelectFiles = createAction(MULTI_SELECT_FILES, (files) => {
  return { files };
});

export const removeFile = createAction(REMOVE_FILE, async (file) => {
  await global.db.files.delete(file.id);
  return { file };
});

export const setSortOrder = createAction(SET_SORT_ORDER, sortOrder => {
  return { sortOrder };
});

export const updateSearchKeyword = createAction(UPDATE_SEARCH_KEYWORD, keyword => {
  return { keyword };
});

export const regenerateThumbnail = createAction(REGENERATE_THUMBNAIL, async selectedFiles => {
  const promises = [];
  const { count, size } = global.config.thumbnail;
  selectedFiles.forEach(f => {
    promises.push(f.createThumbnail({ count, size }, true));
  });
  await Promise.all(promises);
  return { selectedFiles: selectedFiles.map(f => (
    f.set("thumbnailVersion", f.thumbnailVersion + 1)
  )) };
});

export const favorite = createAction(FAVORITE, async selectedFiles => {
  const data = [];
  for (let f of selectedFiles.toArray()) {
    let result = await f.toggleFavorite();
    data.push([f.id, result]);
  }
  const newFiles = new ImmutableMap(data);

  return { selectedFiles: newFiles };
})

export const saveSearchPreset = createAction(SAVE_SEARCH_PRESET, (preset) => {
  const searchPresets = JSON.parse(global.localStorage.getItem("searchPresets")) || {};
  const newPresets = Object.assign({}, searchPresets, preset);
  global.localStorage.setItem("searchPresets", JSON.stringify(newPresets));
  return { newPreset: preset };
});

export const deleteSearchPreset = createAction(DELETE_SEARCH_PRESET, (presetName) => {
  const searchPresets = JSON.parse(global.localStorage.getItem("searchPresets")) || {};
  const newPresets = _.omit(searchPresets, presetName);
  global.localStorage.setItem("searchPresets", JSON.stringify(newPresets));
  return { presetName };
});

export const setCurrentCursorOffset = createAction(SET_CURRENT_CURSOR_OFFSET, offset => {
  return { offset };
});

export function updateDb(targetFiles: List<string>): Function {
  return async dispatch => {
    let count = 0;
    const size = targetFiles.size;
    const promiseProducer = function () {
      if (count < size) {
        const f = targetFiles.get(count);
        const promise = addFile(f).then((mediaFile) => {
          dispatch(finishUpdate(mediaFile));
        });
        count++;
        return promise;
      } else {
        return null
      }
    };

    const pool = new PromisePool(promiseProducer, global.config.thumbnail.concurrency || 1)
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
      mediaFile = await mediaFile.save();
    }
    let { count, size } = global.config.thumbnail;
    await mediaFile.createThumbnail({ count, size });
    return mediaFile;
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
