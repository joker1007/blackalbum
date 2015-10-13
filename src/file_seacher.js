/* @flow */

import _ from 'lodash'
import type { OrderedMap } from 'immutable';
import type MediaFile from './media_file';

export default class FileSeacher {
  files: OrderedMap<number, MediaFile>;

  constructor(files: OrderedMap<number, MediaFile>) {
    this.files = files;
  }

  search(searchKeyword: string): OrderedMap<number,  MediaFile> {
    if (_.isEmpty(searchKeyword))
      return this.files;

    const queries = searchKeyword.split(/ +/).map(word => word.split(":"));
    const result = _.reduce(queries, (files, q) => {
      if (q.length == 1)
        return files.filter(f => this.isIncludeProperty(f, "basename", q[0]));

      switch (q[0]) {
        case "basename":
          return files.filter(f => this.isIncludeProperty(f, "basename", q[1]));
        case "fullpath":
          return files.filter(f => this.isIncludeProperty(f, "fullpath", q[1]));
        case "is":
          return files.filter(f => this.predicateFile(f, q[1]));
      }

    }, this.files);

    return result;
  }

  isIncludeProperty(f: MediaFile, propertyName: string, value: string): boolean {
    if (value.toLowerCase() === value) {
      return f[propertyName].toLowerCase().includes(value);
    } else {
      return f[propertyName].includes(value);
    }
  }

  predicateFile(f: MediaFile, predicate: string): boolean {
    return !!f[predicate];
  }
}
