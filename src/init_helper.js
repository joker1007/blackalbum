let path = require('path');
let fs = require('fs');

export const appDir = path.join(getUserHome(), ".blackalbum");
export const configFile = path.join(appDir, "config.json");
export const defaultThumbnailDir = path.join(appDir, "thumnails");

class Config {
  constructor({ directories, extensions, thumbnail }) {
    this.targetDirectories = directories || [];
    this.extensions = extensions || {};
    let {directory, count, size } = thumbnail || {};
    this.thumbnail = {};
    this.thumbnail.dir = directory || defaultThumbnailDir;
    this.thumbnail.count = count || 5;
    this.thumbnail.size = size || "240";
  }

  get targetExtensions() {
    return Object.keys(this.extensions)
  }

  getAllCommands(extname) {
    return this.extensions[extname]
  }

  getCommand(extname) {
    let commands = this.getAllCommands(extname);
    return commands[Object.keys(commands)[0]];
  }

  getCommandNames(extname) {
    return Object.keys(this.extensions[extname]);
  }
}

export function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

export function initAppDir() {
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir);
  }
  if (!fs.existsSync(defaultThumbnailDir)) {
    fs.mkdirSync(defaultThumbnailDir);
  }
}

export function loadConfig() {
  if (fs.existsSync(configFile)) {
    let conf = JSON.parse(fs.readFileSync(configFile));
    return new Config(conf);
  } else {
    return new Config({});
  }
}

