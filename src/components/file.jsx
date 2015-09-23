import React, { Component, PropTypes } from 'react';
import { parse } from 'shell-quote';
import LazyLoad from 'react-lazy-load';
var childProcess = global.require('child_process');
var path = global.require('path');

export default class FileComponent extends Component {
  render() {
    const { file } = this.props;
    const thumbnails = file.thumbnails.map(th => {
      return (
        <a href="" onClick={this.onClickBasename.bind(this)}>
          <img className="thumb" key={th} src={th} />
        </a>
      );
    });
    return (
      <div key={file.id} className="entry">
        <div className="entry--thumbnails_and_info">
          <div className="thumbnails">
            <LazyLoad>
              {thumbnails}
            </LazyLoad>
          </div>
          <div className="info">
            <table>
              <tr>
                <td>Duration</td><td>{file.durationStr}</td>
              </tr>
              <tr>
                <td>VCodec</td><td>{file.vcodec}</td>
              </tr>
              <tr>
                <td>ACodec</td><td>{file.acodec}</td>
              </tr>
              <tr>
                <td>Res</td><td>{file.resolution}</td>
              </tr>
              <tr>
                <td>Size</td><td>{file.filesize}</td>
              </tr>
            </table>
          </div>
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
    fullpath: PropTypes.string.isRequired
  })
};
