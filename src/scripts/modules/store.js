import { createStore, applyMiddleware, combineReducers } from 'redux';

// Logger with default options
import logger from 'redux-logger';
// import thunk from 'redux-thunk';

import rootReducer from './reducer';
// import * as asyncInitialState from 'redux-async-initial-state';

import { getTabs } from '../components/browserActions';
import { preferences } from '../defaultPreferences';
const thunk = store => next => action => (typeof action === 'function' ? action(store.dispatch) : next(action));
let middlewares = [thunk, logger];

// const addLoggingToDispatch = store => {
//   const rawDispatch = store.dispatch;
//   if (!console.group) {
//     return rawDispatch;
//   }
//   return action => {
//     console.group(action.type);
//     console.log('%c Prev State: ', 'color:gray', store.getState());
//     console.log('Action: ', action);
//     const returnValue = rawDispatch(action);
//     console.log('next state:', store.getState());
//     console.log(rawDispatch(action));
//     console.groupEnd(action.type);
//     return returnValue;
//   };
// };
const addPromiseSupportToDispatch = store => {
  const next = store.dispatch;
  return action => {
    if (typeof action.then == 'function') {
      return action.then(next);
    }
    return next(action);
  };
};
function configureStore() {
  return getTabs().then(tabs => {
    const defaultState = {
      tabs,
      preferences,
    };
    const store = createStore(
      rootReducer,
      defaultState,
      applyMiddleware(...middlewares),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    // store.dispatch = addLoggingToDispatch(store);
    store.dispatch = addPromiseSupportToDispatch(store);
    return store;
  });
}
export default configureStore;
