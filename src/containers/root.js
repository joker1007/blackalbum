/* @flow */

import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import _ from 'lodash';
import { listFiles, updateSearchKeyword, selectFile, removeFile, setSortOrder, multiSelectFiles } from '../actions';
import { allSelector } from '../selectors';
import Header from '../components/header';
import FileList from '../components/file_list';
import AppMenu from './menu';
import KeyHandler from './key_handler';
import ContextMenu from './context_menu';
import type MediaFile from '../media_file';

class Root extends Component {
  componentDidMount() {
    let { dispatch } = this.props;
    dispatch(listFiles());
  }

  render() {
    let {
      dispatch,
      files,
      updating,
      updatingFiles,
      updatedFiles,
      searchKeyword,
      selectedFiles,
      sortOrder
    } = this.props;

    const keyHandlers = {
      'playSelected': this.playSelected.bind(this),
      'removeSelected': this.removeSelected.bind(this),
      'openContextMenu': this.dispatchContextMenu.bind(this),
      'moveDownCursor': this.moveDownCursor.bind(this),
      'moveUpCursor': this.moveUpCursor.bind(this),
      'pageUp': this.pageUp.bind(this),
      'pageDown': this.pageDown.bind(this),
      'halfPageUp': this.halfPageUp.bind(this),
      'halfPageDown': this.halfPageDown.bind(this),
    };

    return (
      <div>
        <Header
          searchKeyword={searchKeyword}
          sortOrder={sortOrder}
          searchFormChangeHandler={this.searchFormChangeHandler.bind(this)}
          sortSelectChangeHandler={this.changeSortOrder.bind(this)}
          fileCount={files.size}
          updating={updating}
          updatingFiles={updatingFiles}
          updatedFiles={updatedFiles}
        />
        <KeyHandler keyHandlers={keyHandlers} />
        <AppMenu />
        <ContextMenu {...this.props} />
        <FileList
          files={files}
          selectedFiles={selectedFiles}
          onClickHandler={this.selectFile.bind(this)} />
      </div>
    );
  }

  searchFormChangeHandler(keyword: string) {
    let { dispatch } = this.props;
    dispatch(updateSearchKeyword(keyword));
  }

  selectFile(e: {shiftKey: boolean}, file: MediaFile) {
    let { dispatch, selectedFiles } = this.props;
    if (!selectedFiles.isEmpty() && e.shiftKey) {
      let { files, currentCursor } = this.props;
      let begin = files.indexOf(currentCursor);
      let end = files.indexOf(file);
      [begin, end] = [begin, end].sort()
      dispatch(multiSelectFiles(files.slice(begin, end + 1)));
    } else {
      dispatch(selectFile(file));
    }
  }

  playSelected(e) {
    let { selectedFiles } = this.props;
    selectedFiles.forEach(f => {
      f.execute();
    });
  }

  removeSelected(e) {
    let { dispatch, selectedFiles } = this.props;
    selectedFiles.forEach(f => {
      dispatch(removeFile(f));
    });
  }

  dispatchContextMenu() {
    window.dispatchEvent(new Event('contextmenu'));
  }

  changeSortOrder(sortOrder) {
    let { dispatch } = this.props;
    dispatch(setSortOrder(sortOrder));
    document.querySelector(".entries").scrollTop = 0;
  }

  moveDownCursor(e) {
    e.preventDefault();
    let { dispatch, files, currentCursor } = this.props;
    let selectedFileIndex = currentCursor ? files.indexOf(currentCursor) : -1;
    let nextFile: ?MediaFile = files.get(selectedFileIndex + 1);
    if (nextFile) {
      dispatch(selectFile(nextFile));
      let entriesEl = document.querySelector(".entries");
      let currentScrollTop = entriesEl.scrollTop;
      entriesEl.scrollTop = currentScrollTop + global.config.entryContainerHeight;
    }
  }

  moveUpCursor() {
    let { dispatch, files, currentCursor } = this.props;
    let selectedFileIndex = currentCursor ? files.indexOf(currentCursor) : 1;
    let nextFile: ?MediaFile = files.get(selectedFileIndex - 1);
    if (nextFile) {
      dispatch(selectFile(nextFile));
      let entriesEl = document.querySelector(".entries");
      let currentScrollTop = entriesEl.scrollTop;
      entriesEl.scrollTop = currentScrollTop - global.config.entryContainerHeight;
    }
  }

  pageDown() {
    let entriesEl = document.querySelector(".entries");
    let currentScrollTop = entriesEl.scrollTop;
    entriesEl.scrollTop = currentScrollTop + entriesEl.clientHeight;
  }

  pageUp() {
    let entriesEl = document.querySelector(".entries");
    let currentScrollTop = entriesEl.scrollTop;
    entriesEl.scrollTop = currentScrollTop - entriesEl.clientHeight;
  }

  halfPageUp() {
    let entriesEl = document.querySelector(".entries");
    let currentScrollTop = entriesEl.scrollTop;
    entriesEl.scrollTop = currentScrollTop + entriesEl.clientHeight / 2;
  }

  halfPageDown() {
    let entriesEl = document.querySelector(".entries");
    let currentScrollTop = entriesEl.scrollTop;
    entriesEl.scrollTop = currentScrollTop - entriesEl.clientHeight / 2;
  }
}

Root.propTypes = {
  files: ImmutablePropTypes.listOf(PropTypes.shape({
    basename: PropTypes.string.isRequired,
    fullpath: PropTypes.string.isRequired,
    filesize: PropTypes.number,
  })).isRequired,
  updating: PropTypes.bool.isRequired,
  updatingFiles: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  updatedFiles: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  searchKeyword: PropTypes.string.isRequired,
  selectedFiles: ImmutablePropTypes.map.isRequired,
  sortOrder: PropTypes.string.isRequired,
  currentCursor: PropTypes.shape({
    basename: PropTypes.string.isRequired,
    fullpath: PropTypes.string.isRequired,
    filesize: PropTypes.number,
  }),
};

export default connect(allSelector)(Root);
