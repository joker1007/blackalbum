import React, { Component, PropTypes } from 'react';
import FileComponent from './file';
import _ from 'lodash';
import Infinite from 'react-infinite';

export default class FileList extends Component {
  constructor(props) {
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

  render() {
    let { files, selectedFiles, onClickHandler } = this.props;
    this.fileComponents = files.map(f => {
      return (
        <FileComponent
          key={f.id}
          file={f}
          selectedFiles={selectedFiles}
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
        {this.fileComponents.toArray()}
      </Infinite>
    );
  }

  updateDisplayHeight() {
    this.setState({displayHeight: window.innerHeight});
  }
}

FileList.propTypes = {
  files: PropTypes.object.isRequired,
  selectedFiles: PropTypes.object.isRequired,
  onClickHandler: PropTypes.func.isRequired,
};
