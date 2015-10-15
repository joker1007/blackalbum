/* flow */

import { defaultThumbnailDir } from './helpers/path_helper';
import _ from 'lodash';
import { List } from 'immutable';

let path = global.require('path');
let _glob = global.require('glob');
let glob = path => {
  return new Promise((resolve, reject) => {
    _glob(path, (err, result) => {
      if (err)
        return reject(err);

      resolve(result);
    });
  });
};

export default class Config {
  targetDirectories: Array<string>;
  players: {[key: string]: string};
  extensions: {[key: string]: Array<string>};
  thumbnail: {dir: string, count: number, size: number};
  filterWords: Array<string>;

  constructor({ directories, players, extensions, thumbnail, filterWords }: Object) {
    this.targetDirectories = directories || [];
    this.players = players || {};
    this.extensions = extensions || {};
    let {directory, count, size } = thumbnail || {};
    this.thumbnail = thumbnail || {};
    this.thumbnail.dir = directory || defaultThumbnailDir;
    this.thumbnail.count = count || 5;
    this.thumbnail.size = size || 240;
    if (Array.isArray(filterWords)) {
      this.filterWords = filterWords.map(w => { return new RegExp(w); });
    } else {
      this.filterWords = [];
    }
  }

  get targetExtensions(): Array<string> {
    return Object.keys(this.extensions)
  }

  get entryContainerHeight(): number {
    return Math.round(this.thumbnail.size / 4 * 3) + 32;
  }

  getAllCommands(extname: string): {[key: string]: string} {
    return _.pick(this.players, (cmd, name) => (_.includes(this.extensions[extname], name)))
  }

  getCommand(extname: string): string {
    const playerName = this.extensions[extname][0];
    return this.players[playerName];
  }

  getCommandNames(extname: string): Array<string> {
    return this.extensions[extname];
  }

  async getTargetFiles(): List<string> {
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

