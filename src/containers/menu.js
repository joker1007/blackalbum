import React, { Component } from 'react';
import { connect } from 'react-redux';
import { requestUpdateDb, updateDb } from '../actions';
import menuTemplate from './menu_template';

let remote = global.require('remote');
let Menu = remote.require('menu');

class AppMenu extends Component {
  componentDidMount() {
    const template = menuTemplate.concat([
      {
        label: 'Tool',
        submenu: [
          {
            label: 'Update Database',
            click: (item, focusedWindow) => {
              let { dispatch } = this.props;
              let updateDbRequestAction = requestUpdateDb();
              dispatch(updateDbRequestAction);
              updateDbRequestAction.payload.then(result => {
                dispatch(updateDb(result.files));
              })
            }
          }
        ]
      }
    ]);

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  render() {
    return null;
  }
}

export default connect()(AppMenu);
