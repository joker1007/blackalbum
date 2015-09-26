import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { HotKeys } from 'react-hotkeys';
import _ from 'lodash';
import { updateSearchKeyword, selectFile, removeFile, setSortOrder, FILENAME_ASC, FILENAME_DESC, FILESIZE_ASC, FILESIZE_DESC, CTIME_ASC, CTIME_DESC } from '../actions';
import Header from '../components/header';
import FileComponent from '../components/file';
import Updating from '../components/updating';
import AppMenu from './menu';

class Root extends Component {
  render() {
    const {
      dispatch,
      files,
      updating,
      updatingFiles,
      updatedFiles,
      searchKeyword,
      selectedFiles,
      sortOrder
    } = this.props;

    const keymap = {
      'pressEnter': ['enter', 'return'],
      'pressDel': ['del'],
    };

    const keyHandlers = {
      'pressEnter': _.debounce(this.playSelected.bind(this), 10),
      'pressDel': _.debounce(this.removeSelected.bind(this), 10),
    };

    const fileComponents = files.map(f => {
      return (
        <FileComponent
          key={f.id}
          file={f}
          selectedFiles={selectedFiles}
          onClickHandler={this.selectFile.bind(this)} />
      );
    }).toArray();

    return (
      <HotKeys keyMap={keymap} handlers={keyHandlers}>
        <div>
          <Header
            searchKeyword={searchKeyword}
            sortOrder={sortOrder}
            searchFormChangeHandler={this.searchFormChangeHandler.bind(this)}
            sortSelectChangeHandler={this.changeSortOrder.bind(this)}
          />
          <AppMenu />
          <Updating updating={updating} updatingFiles={updatingFiles} updatedFiles={updatedFiles} />
          {fileComponents}
        </div>
      </HotKeys>
    );
  }

  searchFormChangeHandler(keyword) {
    const { dispatch } = this.props;
    dispatch(updateSearchKeyword(keyword));
  }

  selectFile(file) {
    const { dispatch } = this.props;
    dispatch(selectFile(file));
  }

  playSelected(e) {
    const { selectedFiles } = this.props;
    selectedFiles.forEach(f => {
      f.execute();
    });
  }

  removeSelected(e) {
    const { dispatch, selectedFiles } = this.props;
    selectedFiles.forEach(f => {
      dispatch(removeFile(f));
    });
  }

  changeSortOrder(sortOrder) {
    const { dispatch } = this.props;
    dispatch(setSortOrder(sortOrder));
  }
}

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

const visibleFilesSelector = createSelector(
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

Root.propTypes = {
  files: PropTypes.object.isRequired,
  updating: PropTypes.bool.isRequired,
  updatingFiles: ImmutablePropTypes.listOf(PropTypes.string),
  updatedFiles: ImmutablePropTypes.listOf(PropTypes.string),
};

export default connect(visibleFilesSelector)(Root);
