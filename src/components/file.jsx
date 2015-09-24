import React, { Component, PropTypes } from 'react';
import { parse } from 'shell-quote';
import LazyLoad from 'react-lazy-load';
var childProcess = global.require('child_process');
var path = global.require('path');

export default class FileComponent extends Component {
  render() {
    const { file } = this.props;
    const thumbnails = file.thumbnails.map(th => {
      let style = {
        backgroundColor: "black",
        backgroundImage: `url("${th}")`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      };
      return (
        <a style={style} href="" key={th} onClick={this.onClickBasename.bind(this)}>
        </a>
      );
    });
    return (
      <div key={file.id} className="entry">
        <div className="entry--thumbnails_and_info">
          <div className="thumbnails">
            <LazyLoad height={Math.round(global.config.thumbnail.size / 4 * 3).toString()}>
              {thumbnails}
            </LazyLoad>
          </div>
          <div className="info">
            <table>
              <tr>
                <td className="info--name">Duration:</td><td>{file.durationStr}</td>
              </tr>
              <tr>
                <td className="info--name">VCodec:</td><td>{file.vcodec}</td>
              </tr>
              <tr>
                <td className="info--name">ACodec:</td><td>{file.acodec}</td>
              </tr>
              <tr>
                <td className="info--name">Res:</td><td>{file.resolution}</td>
              </tr>
              <tr>
                <td className="info--name">Size:</td><td>{file.filesize.toLocaleString()} Byte</td>
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
