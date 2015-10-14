/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { parse } from 'shell-quote';
import classNames from 'classnames';
import humanize from 'humanize';
import { Card, FontIcon } from 'material-ui';
import { MovieFile } from '../media_file';
import type MediaFile from '../media_file';
import type { Map as ImmutableMap } from 'immutable';
import { selectedFilesSelector } from '../selectors';
var childProcess = global.require('child_process');
var path = global.require('path');

class FileComponent extends Component {
  shouldComponentUpdate(nextProps: {file: MediaFile, selectedFiles: ImmutableMap}, nextState: Object): boolean {
    let { file, selectedFiles } = nextProps;
    let selected = !!selectedFiles.get(file.id);
    return (!this.file.equals(file)) ||
      (this.selected !== selected);
  }

  render(): Component {
    let { file, selectedFiles } = this.props;
    this.file = file;
    this.selected = !!selectedFiles.get(file.id);
    const entryClassNames = classNames({
      entry: true,
      selected: this.selected,
      unselectable: true,
      favorited: file.favorited,
    });
    const entryStyle = {
      height: (Math.round(global.config.thumbnail.size / 4 * 3) + 30).toString() + "px",
    };
    const thumbnails = file.thumbnails.map(th => {
      let style = {
        backgroundColor: "black",
        backgroundImage: `url("${th}?${file.thumbnailVersion}")`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      };
      return (
        <a className="entry--thumbnail" style={style} href="" key={th} onClick={this.execute.bind(this)}>
        </a>
      );
    });

    const favorited = file.favorited ?
      <FontIcon className="material-icons">favorite</FontIcon> :
      <FontIcon className="material-icons">favorite_border</FontIcon>

    let info = null;
    if (file.isMovie) {
      info = (
        <table>
          <tr>
            <td className="info--name">Duration:</td>
            <td>{file.durationStr}</td>
          </tr>
          <tr>
            <td className="info--name">VCodec:</td>
            <td>{file.vcodec}</td>
          </tr>
          <tr>
            <td className="info--name">ACodec:</td>
            <td>{file.acodec}</td>
          </tr>
          <tr>
            <td className="info--name">Res:</td>
            <td>{file.resolution}</td>
          </tr>
          <tr>
            <td className="info--name">Size:</td>
            <td>{humanize.filesize(file.filesize)}</td>
          </tr>
          <tr>
            <td className="info--name">Ctime:</td>
            <td>{humanize.date('Y-m-d H:i:s', file.ctime)}</td>
          </tr>
          <tr>
            <td className="info--name">Favorited:</td>
            <td>{favorited}</td>
          </tr>
        </table>
      );
    } else {
      info = (
        <table>
          <tr>
            <td className="info--name">Size:</td>
            <td>{humanize.filesize(file.filesize)}</td>
          </tr>
          <tr>
            <td className="info--name">Ctime:</td>
            <td>{humanize.date('Y-m-d H:i:s', file.ctime)}</td>
          </tr>
          <tr>
            <td className="info--name">Favorited:</td>
            <td>{favorited}</td>
          </tr>
        </table>
      );
    }

    return (
      <Card key={file.id} className={entryClassNames} style={entryStyle} onClick={this.selectFile.bind(this)}>
        <div className="entry--thumbnails_and_info">
          <div className="thumbnails">
            <div style={{height: Math.round(global.config.thumbnail.size / 4 * 3).toString()}}>
              {thumbnails}
            </div>
          </div>
          <div className="info selectable">
            {info}
          </div>
        </div>

        <div className="entry--filename">
          <a className="selectable" href="" onClick={this.execute.bind(this)}>{file.basename}</a>
        </div>
      </Card>
    );
  }

  execute(e: Event): void {
    e.preventDefault();
    let { file } = this.props;

    file.execute();
  }

  selectFile(e: Object): void {
    e.preventDefault();
    const dom = React.findDOMNode(this);
    const { file, onClickHandler } = this.props;
    const parentOffset = document.querySelector(".entries").offsetTop
    onClickHandler(e, file, dom.offsetTop - parentOffset);
  }
}

FileComponent.propTypes = {
  file: PropTypes.shape({
    basename: PropTypes.string.isRequired,
    fullpath: PropTypes.string.isRequired,
    filesize: PropTypes.number,
  }),
  selectedFiles: ImmutablePropTypes.map.isRequired,
  onClickHandler: PropTypes.func.isRequired,
};

export default connect(state => ({selectedFiles: selectedFilesSelector(state)}))(FileComponent);
