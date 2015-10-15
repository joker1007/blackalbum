/* @flow */

import Config from '../config';
import { appDir, yamlConfigFile, jsonConfigFile, defaultThumbnailDir } from './path_helper';
import yaml from 'js-yaml';
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
  try {
    fs.accessSync(yamlConfigFile);
    const conf = yaml.safeLoad(fs.readFileSync(yamlConfigFile));
    return new Config(conf);
  } catch (err) {
    try {
      fs.accessSync(jsonConfigFile);
      const conf = JSON.parse(fs.readFileSync(jsonConfigFile));
      return new Config(conf);
    } catch (err) {
      createDefaultConfig();
      return new Config({});
    }
  }
}

function createDefaultConfig(): void {
  const conf = {
    "directories": [
      "/path/to/target/directory"
    ],
    "players": {
      "mplayer": "write launch player command",
      "vlc": "write launch player command",
      "zipViewer": "write launch player command"
    },
    "extensions": {
      "avi": [
        "mplayer",
        "vlc"
      ],
      "mkv": [
        "mplayer",
        "vlc"
      ],
      "mp4": [
        "mplayer",
        "vlc"
      ],
      "mpg": [
        "mplayer",
        "vlc"
      ],
      "wmv": [
        "mplayer",
        "vlc"
      ],
      "mov": [
        "mplayer",
        "vlc"
      ],
      "zip": [
        "zipViewer"
      ],
    }
  };
  fs.writeFileSync(yamlConfigFile, yaml.safeDump(conf));
}
