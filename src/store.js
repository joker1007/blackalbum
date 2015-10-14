import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import undoable from 'redux-undo';
import { reducer } from './reducers';
import { UPDATE_SEARCH_KEYWORD } from './actions';

const process = global.require('process');

let middlewares = [thunk, promiseMiddleware];

if (process.env.NODE_ENV !== "production") {
  middlewares.push(createLogger());

  const { devTools, persistState } = require('redux-devtools');
  var createStoreWithMiddleware = compose(
    applyMiddleware(...middlewares),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
} else {
  var createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
}

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(undoable(reducer, {
    limit: 10,
    filter: (action, currentState, previousState) => {
      return action.type === UPDATE_SEARCH_KEYWORD;
    }
  }));

  return store;
}
