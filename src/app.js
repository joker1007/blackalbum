import React from 'react';
import { Provider } from 'react-redux';
import Dexie from 'dexie';
import glob from 'glob';
import denodeify from 'denodeify';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
import { reducer } from './reducers';
import { listFiles } from './actions';
import App from './containers/app';

let fs = global.require('fs');
let path = global.require('path');
let stat = denodeify(fs.stat);

let logger = createLogger();
let createStoreWithMiddleware = applyMiddleware(promiseMiddleware, logger)(createStore);
let store = createStoreWithMiddleware(reducer, {files: []});

var db = new Dexie("blackalbum");
db.version(1).stores({
  files: "++id,basename,&fullpath,filesize,ctime"
});

db.open();

// glob("/mnt/bacchus_data1/files2/**/*.{mkv,avi}", (er, files) => {
//   for (let file of files) {
//     stat(file).then(function(stat) {
//       let data = {
//         basename: path.basename(file),
//         fullpath: file,
//         filesize: stat.size,
//         ctime: stat.ctime
//       };
//       db.files.add(data);
//     });
//   }
// });

global.db = db;


document.addEventListener('DOMContentLoaded', () => {
  let rootEl = document.getElementById('main');
  React.render(
    <Provider store={store}>
      {() => <App />}
    </Provider>,
    rootEl
  );
  store.dispatch(listFiles());
});

