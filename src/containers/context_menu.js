/* @flow */

import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { regenerateThumbnail, copyFullpath } from '../actions';

let remote = global.require('electron').remote;
let Menu = remote.Menu;

class ContextMenu extends Component {
  componentDidMount() {
    this.contextMenuHandler = this.popupMenu.bind(this);
    window.addEventListener('contextmenu', this.contextMenuHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('contextmenu', this.contextMenuHandler);
  }

  render(): mixed {
    return null;
  }

  popupMenu(e: mixed): void {
    let { dispatch, selectedFiles } = this.props;
    const selectedFirst = selectedFiles.first();
    if (!selectedFirst) {
      return;
    }
    const template = global.config.getCommandNames(selectedFirst.extname).map(n => {
      return {
        label: n,
        click(item, focusedWindow) {
          selectedFirst.execute(n);
        },
      }
    });

    if (selectedFiles.count() == 1) {
      template.push(
        {type: 'separator'},
        {
          label: "Copy fullpath",
          click(item, focusedWindow) {
            dispatch(copyFullpath(selectedFirst));
          },
        }
      )
    }

    template.push(
      {type: 'separator'},
      {
        label: "Re-generate thumbnail",
        click(item, focusedWindow) {
          dispatch(regenerateThumbnail(selectedFiles));
        },
      }
    )

    const menu = Menu.buildFromTemplate(template);
    menu.popup(remote.getCurrentWindow());
  }
}

ContextMenu.propTypes = {
  selectedFiles: ImmutablePropTypes.map.isRequired,
}

export default connect()(ContextMenu);
