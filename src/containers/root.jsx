/* @flow */

import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { HotKeys } from 'react-hotkeys';
import _ from 'lodash';
import { listFiles, updateSearchKeyword, selectFile, removeFile, setSortOrder } from '../actions';
import { allSelector } from '../selectors';
import Header from '../components/header';
import FileList from '../components/file_list';
import AppMenu from './menu';
import ContextMenu from './context_menu';

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

    const keymap = {
      'pressEnter': ['enter', 'return'],
      'pressShiftEnter': ['shift+enter', 'shift+return'],
      'pressDel': ['del'],
    };

    const keyHandlers = {
      'pressEnter': _.debounce(this.playSelected.bind(this), 10),
      'pressDel': _.debounce(this.removeSelected.bind(this), 10),
      'pressShiftEnter': _.debounce(this.dispatchContextMenu.bind(this), 10),
    };

    return (
      <HotKeys keyMap={keymap} handlers={keyHandlers}>
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
          <AppMenu />
          <ContextMenu {...this.props} />
          <FileList
            files={files}
            selectedFiles={selectedFiles}
            onClickHandler={this.selectFile.bind(this)} />
        </div>
      </HotKeys>
    );
  }

  searchFormChangeHandler(keyword) {
    let { dispatch } = this.props;
    dispatch(updateSearchKeyword(keyword));
  }

  selectFile(file) {
    let { dispatch } = this.props;
    dispatch(selectFile(file));
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
  }
}

Root.propTypes = {
  files: ImmutablePropTypes.orderedMap.isRequired,
  updating: PropTypes.bool.isRequired,
  updatingFiles: ImmutablePropTypes.listOf(PropTypes.string),
  updatedFiles: ImmutablePropTypes.listOf(PropTypes.string),
  searchKeyword: PropTypes.string.isRequired,
  selectedFiles: ImmutablePropTypes.orderedMap.isRequired,
  sortOrder: PropTypes.string.isRequired,
};

export default connect(allSelector)(Root);
