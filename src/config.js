import { defaultThumbnailDir } from './helpers/path_helper';

export default class Config {
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

