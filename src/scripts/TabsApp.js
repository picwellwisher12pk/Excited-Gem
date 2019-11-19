import 'react-devtools';
import React from 'react';
import { render } from 'react-dom';
//Redux
import { Provider } from 'react-redux';
import configureStore from './modules/store';
import ACTIONS from './modules/action';
import ActiveTabs from './ActiveTabs';

var browser = require('webextension-polyfill');

function updateTabs(store, eventName) {
  store.dispatch(ACTIONS.updateActiveTabs(eventName));
}
let TabsApp;
configureStore().then(store => {
  function onRemoved() {
    updateTabs(store, 'Tab Removed/Detached');
  }

  browser.tabs.onRemoved.addListener(onRemoved);
  browser.tabs.onDetached.addListener(onRemoved);

  browser.tabs.onCreated.addListener(() => {
    updateTabs(store, 'Tab Created');
  });
  browser.tabs.onAttached.addListener(() => {
    updateTabs(store, 'Tab Attached');
  });
  browser.tabs.onUpdated.addListener(() => {
    updateTabs(store, 'Tab Updated');
  });
  browser.tabs.onMoved.addListener(() => {
    updateTabs(store, 'Tab Moved');
  });
  TabsApp = render(
    <Provider store={store}>
      <ActiveTabs />
    </Provider>,
    document.querySelector('#root')
  );
});

export default TabsApp;
