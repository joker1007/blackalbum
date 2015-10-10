/* @flow */

const keymaps: {[key: string]: string} = {
  'enter': 'playSelected',
  'shift+enter': 'openContextMenu',
  'del': 'removeSelected',
  'backspace': 'removeSelected',
  'up': 'moveUpCursor',
  'k': 'moveUpCursor',
  'down': 'moveDownCursor',
  'j': 'moveDownCursor',
  'pageup': 'pageUp',
  'pagedown': 'pageDown',
  'ctrl+b': 'pageUp',
  'ctrl+f': 'pageDown',
  'ctrl+d': 'halfPageUp',
  'ctrl+u': 'halfPageDown',
  'f': 'toggleFavorite',
};
export default keymaps;
