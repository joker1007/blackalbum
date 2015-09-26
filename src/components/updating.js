import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

export default class Updating extends Component {
  render() {
    const { updating, updatingFiles, updatedFiles } = this.props;
    if (updating) {
      return (
        <div>
          updating {updatedFiles.size} of {updatingFiles.size} files.
        </div>
      );
    } else {
      return null;
    }
  }
}

Updating.propTypes = {
  updating: PropTypes.bool.isRequired,
  updatingFiles: ImmutablePropTypes.listOf(PropTypes.string),
  updatedFiles: ImmutablePropTypes.listOf(PropTypes.string),
};
