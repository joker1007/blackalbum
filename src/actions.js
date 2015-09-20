import { createAction } from 'redux-actions';
import denodeify from 'denodeify';
import _glob from 'glob';
import MediaFile from './media_file.js';
import PromisePool from 'es6-promise-pool';

let fs = global.require('fs');
let path = global.require('path');
let glob = denodeify(_glob);
let stat = denodeify(fs.stat);

export const LIST_FILES = 'LIST_FILES';
export const UPDATE_DB_REQUEST = 'UPDATE_DB_REQUEST';
export const UPDATE_FINISH_ALL = 'UPDATE_FINISH_ALL';
export const UPDATE_FINISH = 'UPDATE_FINISH';

export let listFiles = createAction(LIST_FILES, async () => {
  let files = await global.db.files.orderBy('basename').toArray();
  let mediaFiles = files.map(data => {
    return new MediaFile(data);
  })
  return { files: mediaFiles };
});

export let requestUpdateDb = createAction(UPDATE_DB_REQUEST, async () => {
  let files = [];
  for (let dir of global.config.targetDirectories) {
    files = files.concat(await glob(path.join(dir, "**", `*.{${global.config.targetExtensions.join(",")}}`)));
  }
  return { files };
});

export let finishUpdate = createAction(UPDATE_FINISH, (file) => {
  console.log(file);
  return {
    finish: file
  };
});

let finishAllUpdate = createAction(UPDATE_FINISH_ALL, () => {
  return {};
});

export function updateDb(targetFiles) {
  return async dispatch => {
    const promiseProducer = function * () {
      for (let f of targetFiles) {
        yield addFile(f);
        dispatch(finishUpdate(f))
      }
    }
    const pool = new PromisePool(promiseProducer, 3)
    await pool.start();
    dispatch(finishAllUpdate());
    dispatch(listFiles());
  };
}

async function addFile(f) {
  let s = await stat(f);
  let data = {
    basename: path.basename(f),
    fullpath: f,
    filesize: s.size,
    ctime: s.ctime
  };
  global.db.files.add(data);
  let mediaFile = new MediaFile(data)
  let { count, size } = global.config.thumbnail
  return mediaFile.createThumbnail({ count, size });
}

