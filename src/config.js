import { defaultThumbnailDir } from './helpers/path_helper';

export default class Config {
  constructor({ directories = [], extensions = {}, thumbnail = {}, filterWords = [] }) {
    this.targetDirectories = directories;
    this.extensions = extensions;
    let {directory = defaultThumbnailDir, count = 5, size = "240" } = thumbnail;
    this.thumbnail = thumbnail;
    this.thumbnail.dir = directory;
    this.thumbnail.count = count;
    this.thumbnail.size = size;
    this.filterWords = filterWords.map(w => { return new RegExp(w); });
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

