import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import DebounceInput from 'react-debounce-input';
import { FILENAME_ASC, FILENAME_DESC, FILESIZE_ASC, FILESIZE_DESC, CTIME_ASC, CTIME_DESC } from '../actions';

export default class Header extends Component {
  render() {
    const { searchKeyword, sortOrder, sortSelectChangeHandler } = this.props;
    const options = [
      {value: FILENAME_ASC, label: 'ファイル名 (昇順)'},
      {value: FILENAME_DESC, label: 'ファイル名 (降順)'},
      {value: FILESIZE_ASC, label: 'ファイルサイズ (昇順)'},
      {value: FILESIZE_DESC, label: 'ファイルサイズ (降順)'},
      {value: CTIME_ASC, label: '作成時 (昇順)'},
      {value: CTIME_DESC, label: '作成時 (降順)'},
    ];
    return (
      <header>
        <h3>BlackAlbum</h3>
        <DebounceInput
          className="search"
          type="text"
          value={searchKeyword}
          onChange={this.changeSearchHandler.bind(this)}
          minLength={2}
          debounceTimeout={200}
        />
        <div className="sort">
          <Select
            name="sort-order"
            value={sortOrder}
            options={options}
            onChange={sortSelectChangeHandler} />
        </div>
      </header>
    );
  }

  changeSearchHandler(value) {
    console.log(value)
    const { searchFormChangeHandler } = this.props;
    searchFormChangeHandler(value);
  }
}

Header.propTypes = {
  searchKeyword: PropTypes.string.isRequired,
  searchFormChangeHandler: PropTypes.func.isRequired,
  sortSelectChangeHandler: PropTypes.func.isRequired,
};
