import { createSelectorCreator, defaultMemoize } from 'reselect';
import _ from 'lodash';
import { FILENAME_ASC, FILENAME_DESC, FULLPATH_ASC, FULLPATH_DESC, FILESIZE_ASC, FILESIZE_DESC, CTIME_ASC, CTIME_DESC } from './actions';

const filesSelector = state => state.get("files");
const updatingSelector = state => state.get("updating");
const updatingFilesSelector = state => state.get("updatingFiles");
const updatedFilesSelector = state => state.get("updatedFiles");
const searchKeywordSelector = state => state.get("searchKeyword");
const selectedFilesSelector = state => state.get("selectedFiles");
const sortOrderSelector = state => state.get("sortOrder");

const visibleFiles = (files, searchKeyword) => {
  if (_.isEmpty(searchKeyword)) {
    return files;
  } else {
    return files.filter(f => {
      return f.basename.includes(searchKeyword);
    });
  }
};

const sortFiles = (files, sortOrder) => {
  switch (sortOrder) {
    case FILENAME_ASC:
      return files.sortBy(f => {return f.basename});
      break;
    case FILENAME_DESC:
      return files.sortBy(f => {return f.basename}).reverse();
      break;
    case FULLPATH_ASC:
      return files.sortBy(f => {return f.fullpath});
      break;
    case FULLPATH_DESC:
      return files.sortBy(f => {return f.fullpath}).reverse();
      break;
    case FILESIZE_ASC:
      return files.sortBy(f => {return f.filesize});
      break;
    case FILESIZE_DESC:
      return files.sortBy(f => {return f.filesize}).reverse();
      break;
    case CTIME_ASC:
      return files.sortBy(f => {return f.ctime});
      break;
    case CTIME_DESC:
      return files.sortBy(f => {return f.ctime}).reverse();
      break;
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
  ({files, searchKeyword, sortOrder}, {updating, updatingFiles, updatedFiles}, selectedFiles) => (
    {
      files,
      searchKeyword,
      sortOrder,
      updating,
      updatingFiles,
      updatedFiles,
      selectedFiles,
    }
  )
);
