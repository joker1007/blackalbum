/* @flow */

import React from 'react';
import { Provider } from 'react-redux';
import Dexie from 'dexie';
import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { reducer } from './reducers';
import { initAppDir, loadConfig } from './helpers/init_helper';
import { initDB } from './db';
import Root from './containers/root';

let fs = global.require('fs');
let path = global.require('path');
let process = global.require('process');

let middlewares = [thunk, promiseMiddleware];

global.production = true;
// @if NODE_ENV='development'
if (process.env.NODE_ENV != "production") {
  var { devTools, persistState } = require('redux-devtools');
  var { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');
  global.production = false;

  middlewares.push(createLogger());
}
// @endif


global.db = initDB();

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
          <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false} />
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
});

