import React from 'react';
import { Provider } from 'react-redux';
import Dexie from 'dexie';
import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { reducer } from './reducers';
import { listFiles } from './actions';
import { initAppDir, loadConfig } from './helpers/init_helper';
import Root from './containers/root';

let fs = global.require('fs');
let path = global.require('path');

let middlewares = [thunk, promiseMiddleware];

global.production = true;
// @if NODE_ENV='development'
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
global.production = false;

let logger = createLogger();
middlewares.push(logger);
// @endif


var db = new Dexie("blackalbum");
db.version(1).stores({
  files: "++id,basename,&fullpath,filesize,ctime,width,height,duration,vcodec,vBitRate,acodec,aBitRate,sampleRate"
});

db.open();

global.db = db;

initAppDir();
global.config = loadConfig();

if (!global.production) {
  var createStoreWithMiddleware = compose(
    applyMiddleware(...middlewares),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
} else {
  var createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
}
let store = createStoreWithMiddleware(reducer);

document.addEventListener('DOMContentLoaded', () => {
  let rootEl = document.getElementById('main');
  if (!global.production) {
    React.render(
      <div>
        <Provider store={store}>
          {() => <Root />}
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
      ,
      rootEl
    );
  } else {
    React.render(
      <div>
        <Provider store={store}>
          {() => <Root />}
        </Provider>
      </div>
      ,
      rootEl
    );
  }
  store.dispatch(listFiles());
});

