/* @flow */

import { createSelectorCreator, defaultMemoize } from 'reselect';
import _ from 'lodash';
import type { Map as ImmutableMap, OrderedMap, List } from 'immutable';
import type MediaFile from './media_file';
import FileSeacher from './file_seacher';
import { FILENAME_ASC, FILENAME_DESC, FULLPATH_ASC, FULLPATH_DESC, FILESIZE_ASC, FILESIZE_DESC, CTIME_ASC, CTIME_DESC } from './actions';

export const filesSelector: (state: Object)         => List<MediaFile>         = state => state.present.get("files").toList();
export const updatingSelector: (state: Object)      => boolean                 = state => state.present.get("updating");
export const updatingFilesSelector: (state: Object) => List<string>            = state => state.present.get("updatingFiles");
export const updatedFilesSelector: (state: Object)  => List<string>            = state => state.present.get("updatedFiles");
export const searchKeywordSelector: (state: Object) => string                  = state => state.present.get("searchKeyword");
export const selectedFilesSelector: (state: Object) => ImmutableMap<MediaFile> = state => state.present.get("selectedFiles");
export const sortOrderSelector: (state: Object)     => string                  = state => state.present.get("sortOrder");
export const currentCursorSelector: (state: Object) => ?MediaFile              = state => state.present.get("currentCursor");

const visibleFiles = (files: OrderedMap, searchKeyword: string) => {
  const searcher = new FileSeacher(files);
  return searcher.search(searchKeyword);
};

const sortFiles = (files: OrderedMap, sortOrder: string) => {
  switch (sortOrder) {
    case FILENAME_ASC:
      return files.sortBy(f => {return f.basename});
    case FILENAME_DESC:
      return files.sortBy(f => {return f.basename}).reverse();
    case FULLPATH_ASC:
      return files.sortBy(f => {return f.fullpath});
    case FULLPATH_DESC:
      return files.sortBy(f => {return f.fullpath}).reverse();
    case FILESIZE_ASC:
      return files.sortBy(f => {return f.filesize});
    case FILESIZE_DESC:
      return files.sortBy(f => {return f.filesize}).reverse();
    case CTIME_ASC:
      return files.sortBy(f => {return f.ctime});
    case CTIME_DESC:
      return files.sortBy(f => {return f.ctime}).reverse();
  }
};


let equalityCheck = (a, b) => {
  if (a && typeof a.equals == "function") {
    return a.equals(b);
  } else {
    return a === b;
  }
};

const createSelector = createSelectorCreator(
  defaultMemoize,
  equalityCheck
);

export const visibleFilesSelector = createSelector(
  filesSelector,
  searchKeywordSelector,
  (files, searchKeyword) => (
    {
      files: visibleFiles(files, searchKeyword),
      searchKeyword: searchKeyword,
    }
  )
);

export const sortFilesSelector = createSelector(
  visibleFilesSelector,
  sortOrderSelector,
  ({files, searchKeyword}, sortOrder) => {
    return {
      files: sortFiles(files, sortOrder),
      searchKeyword: searchKeyword,
      sortOrder: sortOrder,
    }
  }
);

export const composedUpdatingSelector = createSelector(
  updatingSelector,
  updatingFilesSelector,
  updatedFilesSelector,
  (updating, updatingFiles, updatedFiles) => (
    {
      updating,
      updatingFiles,
      updatedFiles,
    }
  )
);

export const allSelector = createSelector(
  sortFilesSelector,
  composedUpdatingSelector,
  selectedFilesSelector,
  currentCursorSelector,
  ({files, searchKeyword, sortOrder}, {updating, updatingFiles, updatedFiles}, selectedFiles, currentCursor) => (
    {
      files,
      searchKeyword,
      sortOrder,
      updating,
      updatingFiles,
      updatedFiles,
      selectedFiles,
      currentCursor,
    }
  )
);
