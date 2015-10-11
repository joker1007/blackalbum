/* @flow */

import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { FILENAME_ASC, FILENAME_DESC, FULLPATH_ASC, FULLPATH_DESC, FILESIZE_ASC, FILESIZE_DESC, CTIME_ASC, CTIME_DESC } from '../actions';
import { TextField, SelectField, FontIcon, IconButton } from 'material-ui';
import SearchTextField from './search_text_field';

export default class Header extends Component {
  render(): Component {
    let {
      searchKeyword,
      searchFormChangeHandler,
      sortOrder,
      sortSelectChangeHandler,
      fileCount,
      updating,
      updatingFiles,
      updatedFiles,
      historyBack,
      historyForward,
    } = this.props;

    const options = [
      {value: FILENAME_ASC, label: 'ファイル名 (昇順)'},
      {value: FILENAME_DESC, label: 'ファイル名 (降順)'},
      {value: FULLPATH_ASC, label: 'フルパス (昇順)'},
      {value: FULLPATH_DESC, label: 'フルパス (降順)'},
      {value: FILESIZE_ASC, label: 'ファイルサイズ (昇順)'},
      {value: FILESIZE_DESC, label: 'ファイルサイズ (降順)'},
      {value: CTIME_ASC, label: '作成時 (昇順)'},
      {value: CTIME_DESC, label: '作成時 (降順)'},
    ];

    const updatingArea = updating ?
      <div className="updating">
        updating {updatedFiles.size} of {updatingFiles.size} files.
      </div> :
      null

    const selectFieldStyle = {
      flex: "0 0 200px",
      marginRight: "4px",
      display: "block",
    }

    return (
      <header>
        <IconButton
          iconClassName="material-icons"
          tooltipPosition="bottom-center"
          tooltip="Undo"
          onClick={historyBack}>undo</IconButton>
        <IconButton
          iconClassName="material-icons"
          tooltipPosition="bottom-center"
          tooltip="Redo"
          onClick={historyForward}>redo</IconButton>
        <FontIcon className="material-icons">search</FontIcon>
        <SearchTextField
          searchKeyword={searchKeyword}
          searchFormChangeHandler={searchFormChangeHandler} />
        <SelectField
          style={selectFieldStyle}
          value={sortOrder}
          valueMember="value"
          displayMember="label"
          menuItems={options}
          onChange={sortSelectChangeHandler} />
        <div className="file-count">
          {fileCount} files
        </div>
        {updatingArea}
      </header>
    );
  }

  changeSearchHandler(ev: Object) {
    this.setState({searchKeyword: ev.target.value});
  }
}

Header.propTypes = {
  searchKeyword: PropTypes.string.isRequired,
  searchFormChangeHandler: PropTypes.func.isRequired,
  sortSelectChangeHandler: PropTypes.func.isRequired,
  fileCount: PropTypes.number.isRequired,
  updating: PropTypes.bool.isRequired,
  updatingFiles: ImmutablePropTypes.listOf(PropTypes.string),
  updatedFiles: ImmutablePropTypes.listOf(PropTypes.string),
  historyBack: PropTypes.func.isRequired,
  historyForward: PropTypes.func.isRequired,
};
