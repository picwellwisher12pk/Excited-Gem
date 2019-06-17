import 'react-devtools';
var browser = require('webextension-polyfill');
import React from 'react';
import { render } from 'react-dom';
import { getTabs } from './components/browserActions';

//Redux
import { Provider } from 'react-redux';
import configureStore from './modules/store';
import ACTIONS from './modules/action';
import ActiveTabs from './ActiveTabs';
function updateTabs(store, eventName) {
  console.log('update tabs', ACTIONS.updateActiveTabs);
  store.dispatch(ACTIONS.updateActiveTabs(eventName));
}
let TabsApp;
configureStore().then(store => {
  function onRemoved(tabId, removeInfo) {
    console.log(ACTIONS.updateActiveTabs);
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
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
    updateTabs(store, 'Tab Updated');
  });
  browser.tabs.onMoved.addListener((tabId, changeInfo, tabInfo) => {
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
