/* @flow */

import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { FILENAME_ASC, FILENAME_DESC, FULLPATH_ASC, FULLPATH_DESC, FILESIZE_ASC, FILESIZE_DESC, CTIME_ASC, CTIME_DESC } from '../actions';
import { TextField, SelectField, FontIcon, IconButton, Dialog, FlatButton } from 'material-ui';
import SearchTextField from './search_text_field';
import SearchPresetItem from './search_preset';

export default class Header extends Component {
  render(): any {
    let {
      searchKeyword,
      searchPresets,
      updateSearchKeyword,
      sortOrder,
      sortSelectChangeHandler,
      fileCount,
      updating,
      updatingFiles,
      updatedFiles,
      historyBack,
      historyForward,
      deleteSearchPresetHandler,
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
      null;

    const selectFieldStyle = {
      flex: "0 0 200px",
      marginRight: "4px",
      display: "block",
    };

    const searchPresetsList = _.map(searchPresets.toJS(), (searchKeyword, name) => {
      return <SearchPresetItem
        key={name}
        name={name}
        searchKeyword={searchKeyword}
        updateSearchKeyword={updateSearchKeyword}
        closeSearchPresetDialog={this.closeSearchPresetDialog.bind(this)}
        deleteSearchPresetHandler={deleteSearchPresetHandler} />;
    });

    return (
      <header>
        <IconButton
          iconClassName="material-icons"
          tooltipPosition="bottom-center"
          tooltip="Undo"
          onClick={historyBack}>keyboard_arrow_left</IconButton>
        <IconButton
          iconClassName="material-icons"
          tooltipPosition="bottom-center"
          tooltip="Redo"
          onClick={historyForward}>keyboard_arrow_right</IconButton>
        <FontIcon className="material-icons">search</FontIcon>
        <SearchTextField
          searchKeyword={searchKeyword}
          searchFormChangeHandler={updateSearchKeyword} />
        <IconButton
          iconClassName="material-icons save"
          tooltipPosition="bottom-center"
          tooltip="Save"
          onClick={this.openSearchPresetDialog.bind(this)}>list</IconButton>
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

        <Dialog
          ref="searchPresetDialog"
          title="Search query presets">
          <ul className="collection">
            {searchPresetsList}
          </ul>
          <div className="new_preset_form">
            <TextField ref="newPresetName" hintText="Input new preset name" />
            &nbsp;
            <FlatButton label="Save" onClick={this.onClickSaveSearchPreset.bind(this)} />
          </div>
          <pre>current: {searchKeyword}</pre>
        </Dialog>
      </header>
    );
  }

  changeSearchHandler(ev: Object) {
    this.setState({searchKeyword: ev.target.value});
  }

  openSearchPresetDialog() {
    this.refs.searchPresetDialog.show();
  }

  closeSearchPresetDialog() {
    this.refs.searchPresetDialog.dismiss();
  }

  onClickSaveSearchPreset() {
    const { searchKeyword, saveSearchPresetHandler } = this.props;
    saveSearchPresetHandler({
      [this.refs.newPresetName.getValue()]: searchKeyword,
    });
    this.refs.newPresetName.clearValue();
  }
}

Header.propTypes = {
  searchKeyword: PropTypes.string.isRequired,
  searchPresets: PropTypes.object.isRequired,
  updateSearchKeyword: PropTypes.func.isRequired,
  sortSelectChangeHandler: PropTypes.func.isRequired,
  fileCount: PropTypes.number.isRequired,
  updating: PropTypes.bool.isRequired,
  updatingFiles: ImmutablePropTypes.listOf(PropTypes.string),
  updatedFiles: ImmutablePropTypes.listOf(PropTypes.string),
  historyBack: PropTypes.func.isRequired,
  historyForward: PropTypes.func.isRequired,
  saveSearchPresetHandler: PropTypes.func.isRequired,
  deleteSearchPresetHandler: PropTypes.func.isRequired,
};
