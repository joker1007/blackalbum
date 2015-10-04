/* @flow */

import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import FileComponent from './file';
import _ from 'lodash';
import Infinite from 'react-infinite';
import { OrderedMap, Set as ImmutableSet } from 'immutable';
import type { List, Map as ImmutableMap } from 'immutable';
import type MediaFile from '../media_file';

export default class FileList extends Component {
  files: List<MediaFile>;

  constructor(props: Object) {
    super(props);
    this.state = {displayHeight: window.innerHeight};
  }

  componentDidMount() {
    this.updateDisplayHeightBinded = this.updateDisplayHeight.bind(this);
    window.addEventListener("resize", this.updateDisplayHeightBinded);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDisplayHeightBinded);
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object): boolean {
    return !(this.files === nextProps.files);
  }

  render() {
    let { files, onClickHandler } = this.props;
    this.files = files;
    let fileComponents = files.map(f => {
      return (
        <FileComponent
          key={f.id}
          file={f}
          onClickHandler={onClickHandler} />
      );
    });

    return (
      <Infinite
        className="entries"
        containerHeight={this.state.displayHeight - 80}
        elementHeight={global.config.entryContainerHeight}
        timeScrollStateLastsForAfterUserScrolls={50}
        preloadBatchSize={this.state.displayHeight - 80}
        preloadAdditionalHeight={(this.state.displayHeight - 80) * 2}>
        {fileComponents}
      </Infinite>
    );
  }

  updateDisplayHeight() {
    this.setState({displayHeight: window.innerHeight});
  }
}

FileList.propTypes = {
  files: ImmutablePropTypes.listOf(
    PropTypes.shape({
      basename: PropTypes.string.isRequired,
      fullpath: PropTypes.string.isRequired,
      filesize: PropTypes.number,
    })
  ).isRequired,
  onClickHandler: PropTypes.func.isRequired,
};
