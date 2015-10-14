/* @flow */

import React from 'react';
import { Provider } from 'react-redux';
import Dexie from 'dexie';
import configureStore from './store';
import { initAppDir, loadConfig } from './helpers/init_helper';
import { initDB } from './db';
import Root from './containers/root';
import injectTapEventPlugin from "react-tap-event-plugin";

injectTapEventPlugin();

const process = global.require('process');
const fs = global.require('fs');
const path = global.require('path');

global.db = initDB();

initAppDir();
global.config = loadConfig();

const store = configureStore({});

document.addEventListener('DOMContentLoaded', () => {
const rootEl = document.getElementById('main');
  React.render(
    <div>
      <Provider store={store}>
        {() => <Root />}
      </Provider>
    </div>
    ,
    rootEl
  );
});

