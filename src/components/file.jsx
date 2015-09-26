import React, { Component, PropTypes } from 'react';
import { parse } from 'shell-quote';
import LazyLoad from 'react-lazy-load';
import classNames from 'classnames';
var childProcess = global.require('child_process');
var path = global.require('path');

export default class FileComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    let { file, selectedFiles } = nextProps;
    let selected = !!selectedFiles.get(file.id.toString());
    return (this.file !== file) || (this.selected !== selected);
  }

  render() {
    const { file, selectedFiles } = this.props;
    this.file = file;
    this.selected = !!selectedFiles.get(file.id.toString());
    const entryClassNames = classNames({
      entry: true,
      selected: this.selected,
      unselectable: true,
    });
    const thumbnails = file.thumbnails.map(th => {
      let style = {
        backgroundColor: "black",
        backgroundImage: `url("${th}")`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      };
      return (
        <a style={style} href="" key={th} onClick={this.execute.bind(this)}>
        </a>
      );
    });
    return (
      <div key={file.id} className={entryClassNames} onClick={this.selectFile.bind(this)}>
        <div className="entry--thumbnails_and_info">
          <div className="thumbnails">
            <LazyLoad height={Math.round(global.config.thumbnail.size / 4 * 3).toString()}>
              {thumbnails}
            </LazyLoad>
          </div>
          <div className="info selectable">
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

        <a className="selectable" href="" onClick={this.execute.bind(this)}>{file.basename}</a>
      </div>
    );
  }

  execute(e) {
    e.preventDefault();
    const { file } = this.props;

    file.execute();
  }

  selectFile(e) {
    e.preventDefault();
    const { file, onClickHandler } = this.props;
    onClickHandler(file);
  }
}

FileComponent.propTypes = {
  file: PropTypes.shape({
    basename: PropTypes.string.isRequired,
    fullpath: PropTypes.string.isRequired
  }),
  selectedFiles: PropTypes.object.isRequired,
  onClickHandler: PropTypes.func.isRequired,
};
