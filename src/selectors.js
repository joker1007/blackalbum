import { createSelector } from 'reselect';
import _ from 'lodash';
import { FILENAME_ASC, FILENAME_DESC, FILESIZE_ASC, FILESIZE_DESC, CTIME_ASC, CTIME_DESC } from './actions';

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

export const visibleFilesSelector = createSelector(
  filesSelector,
  updatingSelector,
  updatingFilesSelector,
  updatedFilesSelector,
  searchKeywordSelector,
  selectedFilesSelector,
  sortOrderSelector,
  (files, updating, updatingFiles, updatedFiles, searchKeyword, selectedFiles, sortOrder) => {
    return {
      files: sortFiles(visibleFiles(files, searchKeyword), sortOrder),
      updating: updating,
      updatingFiles: updatingFiles,
      updatedFiles: updatedFiles,
      searchKeyword: searchKeyword,
      selectedFiles: selectedFiles,
      sortOrder: sortOrder,
    }
  }
);
