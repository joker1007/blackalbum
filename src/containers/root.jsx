import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { updateSearchKeyword } from '../actions';
import Header from '../components/header';
import FileComponent from '../components/file';
import Updating from '../components/updating';
import AppMenu from './menu';

class Root extends Component {
  render() {
    const { dispatch, files, updating, updatingFiles, updatedFiles, searchKeyword } = this.props;

    const fileComponents = files.map(f => {
      return <FileComponent key={f.id} file={f} />;
    });

    return (
      <div>
        <Header searchKeyword={searchKeyword} searchFormChangeHandler={this.searchFormChangeHandler.bind(this)} />
        <AppMenu />
        <Updating updating={updating} updatingFiles={updatingFiles} updatedFiles={updatedFiles} />
        {fileComponents}
      </div>
    );
  }

  searchFormChangeHandler(keyword) {
    const { dispatch } = this.props;
    dispatch(updateSearchKeyword(keyword));
  }
}

function select(state) {
  const {updating, updatingFiles, updatedFiles, searchKeyword } = state;

  let files = null;
  if (_.isEmpty(searchKeyword)) {
    files = state.files;
  } else {
    files = _.filter(state.files, f => {
      return f.basename.includes(searchKeyword);
    });
  }
  return {
    files,
    updating,
    updatingFiles,
    updatedFiles,
    searchKeyword,
  };
}

Root.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    basename: PropTypes.string.isRequired,
    fullpath: PropTypes.string.isRequired
  })),
  updating: PropTypes.bool.isRequired,
  updatingFiles: PropTypes.arrayOf(PropTypes.string),
  updatedFiles: PropTypes.arrayOf(PropTypes.string),
};

export default connect(select)(Root);
