import React from 'react';
import 'react-devtools';
import {render} from 'react-dom';
import ActiveTabs from './ActiveTabs';
import {getTabs, setBadge} from "./components/browserActions";
let preferences = {};
let env = require('../../utils/env');
window.client =  env.browserClient == 'firefox' ? browser : chrome;
console.log("Node ENV:",process.env.NODE_ENV);

client.tabs.onRemoved.addListener(onRemoved);

function onRemoved(tabId, removeInfo) {
    getTabs().then (tabs =>{
      window.tabs = tabs.filter(tab => tab.id != tabId);
      setBadge(window.tabs.length);
      window.activeTabs.setState({tabs:window.tabs});
      });
  }
client.tabs.onCreated.addListener(
  () => {
    getTabs().then(tabs => {
      window.tabs = tabs;
      window.activeTabs.setState({tabs:window.tabs});
      setBadge(window.tabs.length);
      });
  });
client.tabs.onAttached.addListener(
  () => {
    getTabs().then(tabs => {
      window.tabs = tabs;
      window.activeTabs.setState({tabs:window.tabs});
      setBadge(window.tabs.length);
    });
  });
client.tabs.onDetached.addListener(onRemoved);
client.tabs.onUpdated.addListener(
  (tabId,changeInfo, tabInfo) => {
      getTabs().then(tabs => {
        window.tabs = tabs;
        window.activeTabs.setState({tabs: window.tabs});
      });
  });

getTabs().then((tabs)=> {window.tabs = tabs;});
client.storage.local.get('preferences', function(result) {
  window.activeTabs = render(<ActiveTabs tabs={window.tabs} client={client} preferences={result.preferences} NODE_ENV={env.NODE_ENV} />, document.querySelector("#root"));
});
