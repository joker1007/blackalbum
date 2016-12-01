/* @flow */

import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { fade } from 'material-ui/utils/colorManipulator';
import { Snackbar } from 'material-ui';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import _ from 'lodash';
import {
  listFiles,
  updateSearchKeyword,
  selectFile,
  removeFile,
  setSortOrder,
  multiSelectFiles,
  favorite,
  saveSearchPreset,
  deleteSearchPreset,
  setCurrentCursorOffset
} from '../actions';
import { ActionCreators } from 'redux-undo';
import { allSelector } from '../selectors';
import Header from '../components/header';
import FileList from '../components/file_list';
import AppMenu from './menu';
import KeyHandler from './key_handler';
import ContextMenu from './context_menu';
import type MediaFile from '../media_file';

const customTheme = getMuiTheme(darkBaseTheme, {
  primary1Color: '#0097a7',
  primary2Color: '#0097a7',
  primary3Color: '#00acc1',
  accent1Color: '#ff4081',
  accent2Color: '#f50057',
  accent3Color: '#ff80ab',
  textColor: 'rgba(255, 255, 255, 1)',
  alternateTextColor: '#303030',
  canvasColor: '#303030',
  borderColor: fade('rgba(255, 255, 255, 1)', 0.3),
  disabledColor: fade('rgba(255, 255, 255, 1)', 0.3)
});

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedFileNotificationOpen: false
    };
  }

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
      sortOrder,
      searchPresets,
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
      'toggleFavorite': this.toggleFavorite.bind(this),
      'historyBack': this.historyBack.bind(this),
      'historyForward': this.historyForward.bind(this),
    };

    const updatedFileNotificationMessage = updatedFiles.isEmpty() ?
      "Update Database Complete" :
      `Add: ${updatedFiles.last()}`;

    const updatedFileNotification = (
      <Snackbar
        ref="updatedFileNotification"
        open={updating}
        autoHideDuration={3000}
        message={updatedFileNotificationMessage} />
    );

    return (
      <MuiThemeProvider muiTheme={customTheme}>
        <div>
          <Header
            searchKeyword={searchKeyword}
            searchPresets={searchPresets}
            sortOrder={sortOrder}
            updateSearchKeyword={this.updateSearchKeyword.bind(this)}
            sortSelectChangeHandler={this.changeSortOrder.bind(this)}
            fileCount={files.size}
            updating={updating}
            updatingFiles={updatingFiles}
            updatedFiles={updatedFiles}
            historyBack={this.historyBack.bind(this)}
            historyForward={this.historyForward.bind(this)}
            saveSearchPresetHandler={this.saveSearchPresetHandler.bind(this)}
            deleteSearchPresetHandler={this.deleteSearchPresetHandler.bind(this)}
          />
          <KeyHandler keyHandlers={keyHandlers} />
          <AppMenu />
          <ContextMenu {...this.props} />
          <FileList
            files={files}
            selectedFiles={selectedFiles}
            onClickHandler={this.selectFile.bind(this)} />
          {updatedFileNotification}
        </div>
      </MuiThemeProvider>
    );
  }

  updateSearchKeyword(keyword: string) {
    let { dispatch } = this.props;
    dispatch(updateSearchKeyword(keyword));
  }

  selectFile(e: {shiftKey: boolean}, file: MediaFile, offset: number) {
    let { dispatch, selectedFiles } = this.props;
    if (!selectedFiles.isEmpty() && e.shiftKey) {
      let { files, currentCursor } = this.props;
      let begin = files.indexOf(currentCursor);
      let end = files.indexOf(file);
      [begin, end] = [begin, end].sort()
      dispatch(multiSelectFiles(files.slice(begin, end + 1)));
    } else {
      dispatch(selectFile(file));
      dispatch(setCurrentCursorOffset(offset));
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

  changeSortOrder(ev, index, value) {
    let { dispatch } = this.props;
    dispatch(setSortOrder(value));
    document.querySelector(".entries").scrollTop = 0;
  }

  moveDownCursor(e) {
    e.preventDefault();
    let { dispatch, files, currentCursor, currentCursorOffset } = this.props;
    let selectedFileIndex = currentCursor ? files.indexOf(currentCursor) : -1;
    let nextFile: ?MediaFile = files.get(selectedFileIndex + 1);
    if (nextFile) {
      dispatch(selectFile(nextFile));
      let entriesEl = document.querySelector(".entries");
      let nextOffset = Math.max(currentCursorOffset + global.config.entryContainerHeight, 0);
      let nextScroll = Math.max(currentCursorOffset + global.config.entryContainerHeight * 0.5, 0)
      entriesEl.scrollTop = nextScroll;
      dispatch(setCurrentCursorOffset(nextOffset));
    }
  }

  moveUpCursor() {
    let { dispatch, files, currentCursor, currentCursorOffset } = this.props;
    let selectedFileIndex = currentCursor ? files.indexOf(currentCursor) : 1;
    if (selectedFileIndex <= 0)
      return;
    let nextFile: ?MediaFile = files.get(selectedFileIndex - 1);
    if (nextFile) {
      dispatch(selectFile(nextFile));
      let entriesEl = document.querySelector(".entries");
      let nextOffset = Math.max(currentCursorOffset - global.config.entryContainerHeight, 0);
      entriesEl.scrollTop = nextOffset;
      dispatch(setCurrentCursorOffset(nextOffset));
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

  historyBack() {
    let { dispatch } = this.props;
    dispatch(ActionCreators.undo());
  }

  historyForward() {
    let { dispatch } = this.props;
    dispatch(ActionCreators.redo());
  }

  toggleFavorite() {
    let { dispatch, selectedFiles } = this.props;
    dispatch(favorite(selectedFiles));
  }

  saveSearchPresetHandler(preset) {
    let { dispatch } = this.props;
    dispatch(saveSearchPreset(preset));
  }

  deleteSearchPresetHandler(presetName) {
    let { dispatch } = this.props;
    dispatch(deleteSearchPreset(presetName));
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
