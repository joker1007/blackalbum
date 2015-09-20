import React from 'react';
import { Provider } from 'react-redux';
import Dexie from 'dexie';
import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { reducer } from './reducers';
import { listFiles } from './actions';
import { initAppDir, loadConfig } from './init_helper';
import App from './containers/app';

let fs = global.require('fs');
let path = global.require('path');

let logger = createLogger();
let createStoreWithMiddleware = compose(
  applyMiddleware(thunk, promiseMiddleware, logger),
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);
let store = createStoreWithMiddleware(reducer);

var db = new Dexie("blackalbum");
db.version(1).stores({
  files: "++id,basename,&fullpath,filesize,ctime"
});

db.open();

global.db = db;

initAppDir();
global.config = loadConfig();

document.addEventListener('DOMContentLoaded', () => {
  let rootEl = document.getElementById('main');
  React.render(
    <div>
      <Provider store={store}>
        {() => <App />}
      </Provider>
      <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
      </DebugPanel>
    </div>
    ,
    rootEl
  );
  store.dispatch(listFiles());
});

