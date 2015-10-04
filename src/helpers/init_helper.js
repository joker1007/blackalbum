/* @flow */

import Config from '../config';
import { appDir, configFile, defaultThumbnailDir } from './path_helper';
let fs = global.require('fs');

export function initAppDir(): void {
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir);
  }
  if (!fs.existsSync(defaultThumbnailDir)) {
    fs.mkdirSync(defaultThumbnailDir);
  }
}

export function loadConfig(): Config {
  if (fs.existsSync(configFile)) {
    let conf = JSON.parse(fs.readFileSync(configFile));
    return new Config(conf);
  } else {
    return new Config({});
  }
}

