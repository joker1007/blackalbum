import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../components/header';
import FileComponent from '../components/file';
import Updating from '../components/updating';
import AppMenu from './menu';

class Root extends Component {
  render() {
    const { dispatch, files, updating, updatingFiles, updatedFiles } = this.props;

    const fileComponents = files.map(f => {
      return <FileComponent key={f.id} file={f} />;
    });

    return (
      <div>
        <Header />
        <AppMenu />
        <Updating updating={updating} updatingFiles={updatingFiles} updatedFiles={updatedFiles} />
        {fileComponents}
      </div>
    );
  }
}

function select(state) {
  return {
    files: state.files,
    updating: state.updating,
    updatingFiles: state.updatingFiles,
    updatedFiles: state.updatedFiles,
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
