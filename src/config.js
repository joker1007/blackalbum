import { defaultThumbnailDir } from './helpers/path_helper';
import _ from 'lodash';
import { List } from 'immutable';
import _glob from 'glob';
import denodeify from 'denodeify';

let path = global.require('path');
let glob = denodeify(_glob);

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

  get entryContainerHeight() {
    return Math.round(this.thumbnail.size / 4 * 3) + 34;
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

  async getTargetFiles() {
    const files = new List().asMutable();
    for (let dir of this.targetDirectories) {
      let globbed = await glob(path.join(dir, "**", `*.{${this.targetExtensions.join(",")}}`));
      for (let f of globbed) {
        let normalized = f.normalize();
        let valid = _.all(this.filterWords, w => {
          return !normalized.match(w);
        })
        if (valid) {
          files.push(normalized);
        }
      }
    }
    return files.asImmutable();
  }
}

