import React, { Component, PropTypes } from 'react';

export default class Updating extends Component {
  render() {
    const { updating, updatingFiles, updatedFiles } = this.props;
    if (updating) {
      return (
        <div>
          updating {updatedFiles.length} of {updatingFiles.length} files.
        </div>
      );
    } else {
      return null;
    }
  }
}

Updating.propTypes = {
  updating: PropTypes.bool.isRequired,
  updatingFiles: PropTypes.arrayOf(PropTypes.string),
  updatedFiles: PropTypes.arrayOf(PropTypes.string),
};
