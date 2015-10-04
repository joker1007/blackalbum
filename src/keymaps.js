/* @flow */

const keymaps: {[key: string]: string} = {
  'enter': 'playSelected',
  'shift+enter': 'openContextMenu',
  'del': 'removeSelected',
  'backspace': 'removeSelected',
  'up': 'moveUpCursor',
  'down': 'moveDownCursor',
};
export default keymaps;
