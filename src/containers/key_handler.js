/* @flow */

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import keymaps from '../keymaps';
import Mousetrap from 'mousetrap';

export default class KeyHandler extends Component {
  constructor(props: any) {
    super(props);
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
  }

  componentDidMount() {
    _.each(keymaps, (val, key) => {
      Mousetrap.bind(key, this.handleKeyEvent);
    });
  }

  componentWillUnmount() {
    _.each(keymaps, (val, key) => {
      Mousetrap.unbind(key);
    });
  }

  handleKeyEvent(e: Event, keyString: string): void {
    let { keyHandlers } = this.props;
    const handlerName: string = keymaps[keyString];
    let handler: ?Function = keyHandlers[handlerName];
    handler && handler(e, keyString);
  }

  render(): any {
    return null;
  }
}

KeyHandler.propTypes = {
  keyHandlers: PropTypes.objectOf(PropTypes.func).isRequired,
};
