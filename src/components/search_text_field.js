/* @flow */

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { TextField } from 'material-ui';

export default class SearchTextField extends Component {
  constructor(props: Object) {
    super(props)
    let { searchKeyword, searchFormChangeHandler } = this.props;
    this.searchFormChangeHandler = _.debounce(searchFormChangeHandler, 400);
    this.changedByProps = false;
    this.state = {searchKeyword: searchKeyword};
  }

  componentWillReceiveProps({searchKeyword}: Object) {
    if (typeof searchKeyword !== "undefined" && this.state.searchKeyword !== searchKeyword) {
      this.changedByProps = true;
      this.setState({searchKeyword});
    }
  }

  shouldComponentUpdate(props: Object, state: Object): boolean {
    return this.state.searchKeyword !== state.searchKeyword;
  }

  componentWillUpdate(props: Object, state: Object) {
    if (!this.changedByProps)
      this.searchFormChangeHandler(state.searchKeyword);
  }

  componentDidUpdate(props: Object, state: Object) {
    this.changedByProps = false;
  }

  render(): any {
    return (
      <TextField
        value={this.state.searchKeyword}
        hintText="basename:foo fullpath:dir1 is:favorited"
        onChange={this.onChange.bind(this)}
        className="search no-border" />
    );
  }

  onChange(ev: Object) {
    this.setState({searchKeyword: ev.target.value});
  }
}

SearchTextField.propTypes = {
  searchKeyword: PropTypes.string.isRequired,
  searchFormChangeHandler: PropTypes.func.isRequired,
};
