import React, { Component } from 'react';

let remote = global.require('remote');
let Menu = remote.require('menu');

export default class ContextMenu extends Component {
  componentDidMount() {
    this.contextMenuHandler = this.popupMenu.bind(this);
    window.addEventListener('contextmenu', this.contextMenuHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('contextmenu', this.contextMenuHandler);
  }

  render() {
    return null;
  }

  popupMenu(e) {
    const { selectedFiles } = this.props;
    const selected = selectedFiles.first();
    if (!selected) {
      return;
    }
    const template = global.config.getCommandNames(selected.extname).map(n => {
      return {
        label: n,
        click(item, focusedWindow) {
          selected.execute(n);
        },
      }
    });

    const menu = Menu.buildFromTemplate(template);
    menu.popup(remote.getCurrentWindow());
  }
}
