/* @flow */

import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { FILENAME_ASC, FILENAME_DESC, FULLPATH_ASC, FULLPATH_DESC, FILESIZE_ASC, FILESIZE_DESC, CTIME_ASC, CTIME_DESC } from '../actions';
import { TextField, SelectField } from 'material-ui';

export default class Header extends Component {
  constructor(props: Object) {
    super(props)
    this.changeSearchHandler = _.debounce(this.changeSearchHandler.bind(this), 400);
  }

  render(): Component {
    let {
      searchKeyword,
      sortOrder,
      sortSelectChangeHandler,
      fileCount,
      updating,
      updatingFiles,
      updatedFiles
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

    let updatingArea = updating ?
      <div className="updating">
        updating {updatedFiles.size} of {updatingFiles.size} files.
      </div> :
      null

    return (
      <header>
        <h3>BlackAlbum</h3>
        <TextField
          ref="search"
          defaultValue={searchKeyword}
          hintText="basename:foo fullpath:dir1"
          onChange={this.changeSearchHandler}
          className="search" />
        <SelectField
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

  changeSearchHandler(ev: Event) {
    let { searchFormChangeHandler } = this.props;
    searchFormChangeHandler(this.refs.search.getValue());
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
};
