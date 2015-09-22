import React, { Component, PropTypes } from 'react';
import { parse } from 'shell-quote';
import LazyLoad from 'react-lazy-load';
var childProcess = global.require('child_process');
var path = global.require('path');

export default class FileComponent extends Component {
  render() {
    const { file } = this.props;
    const thumbnails = file.thumbnails.map(th => {
      return <img className="thumb" key={th} src={th} />
    });
    return (
      <div key={file.id} className="entry">
        <div>
          <LazyLoad>
            <a href="" onClick={this.onClickBasename.bind(this)}>
              {thumbnails}
            </a>
          </LazyLoad>
        </div>
        <a href="" onClick={this.onClickBasename.bind(this)}>{file.basename}</a>
      </div>
    );
  }

  onClickBasename(e) {
    e.preventDefault();
    const { file } = this.props;

    file.execute();
  }
}

FileComponent.propTypes = {
  file: PropTypes.shape({
    basename: PropTypes.string.isRequired,
    fullpath: PropTypes.string.isRequired,
    filesize: PropTypes.number.isRequired
  })
};
