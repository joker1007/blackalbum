/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert';
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
          },
          {
            label: 'Clear Database',
            click: (item, focusedWindow) => {
              swal({
                title: "Are you sure?",
                text: "You will not be able to recover database",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Clear",
                closeOnConfirm: true,
                html: false,
              }, () =>{
                indexedDB.deleteDatabase("blackalbum");
                window.location.reload();
              });
            }
          },
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
