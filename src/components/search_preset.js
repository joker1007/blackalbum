/* @flow */

import React, { Component, PropTypes } from 'react';
import { IconButton } from 'material-ui';

export default class SearchPresetItem extends Component {
  render(): any {
    let { name, searchKeyword} = this.props;

    return (
      <li key={name} className="collection-item">
        <a href="" onClick={this.onClickSearchPreset.bind(this)}>{name}: {searchKeyword}</a>
        <IconButton
          iconClassName="material-icons search_preset--delete"
          onClick={this.onClickDeleteSearchPreset.bind(this)}>delete</IconButton>
      </li>
    );
  }

  onClickSearchPreset(e: Object) {
    e.preventDefault();
    const { searchKeyword, updateSearchKeyword, closeSearchPresetDialog } = this.props;
    updateSearchKeyword(searchKeyword);
    closeSearchPresetDialog();
  }

  onClickDeleteSearchPreset() {
    const { name, deleteSearchPresetHandler } = this.props;
    deleteSearchPresetHandler(name);
  }
}

SearchPresetItem.propTypes = {
  name: PropTypes.string.isRequired,
  searchKeyword: PropTypes.string.isRequired,
  deleteSearchPresetHandler: PropTypes.func.isRequired,
  updateSearchKeyword: PropTypes.func.isRequired,
  closeSearchPresetDialog: PropTypes.func.isRequired,
};
