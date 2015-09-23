import React, { Component, PropTypes } from 'react';
import DebounceInput from 'react-debounce-input';

export default class Header extends Component {
  render() {
    const { searchKeyword } = this.props;
    return (
      <header>
        <h3>BlackAlbum</h3>
        <DebounceInput
          className="search"
          type="text"
          value={searchKeyword}
          onChange={this.changeHandler.bind(this)}
          minLength={2}
          debounceTimeout={200}
        />
      </header>
    );
  }

  changeHandler(value) {
    console.log(value)
    const { searchFormChangeHandler } = this.props;
    searchFormChangeHandler(value);
  }
}

Header.propTypes = {
  searchKeyword: PropTypes.string.isRequired,
  searchFormChangeHandler: PropTypes.func.isRequired,
};
