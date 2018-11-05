import 'react-devtools';
import React from 'react';
import {render} from 'react-dom';
import ActiveTabs from './ActiveTabs';
import {getTabs} from "./components/browserActions";

function onRemoved(tabId, removeInfo) {
    getTabs().then (tabs =>{
      window.tabs = tabs.filter(tab => tab.id != tabId);
      window.activeTabs.setState({tabs:window.tabs});
      });
}
getTabs().then((tabs)=> {window.tabs = tabs;});


browser.tabs.onRemoved.addListener(onRemoved);
browser.tabs.onDetached.addListener(onRemoved);

browser.tabs.onCreated.addListener(
  () => {
    getTabs().then(tabs => {
      console.log("onCreated:",tabs);
      window.tabs = tabs;
      window.activeTabs.setState({tabs});
      });
  });
browser.tabs.onAttached.addListener(
  () => {
    getTabs().then(tabs => {
      window.tabs = tabs;
      window.activeTabs.setState({tabs});
    });
  });
browser.tabs.onUpdated.addListener(
  (tabId,changeInfo, tabInfo) => {
      getTabs().then(tabs => {
        window.tabs = tabs;
        window.activeTabs.setState({tabs});
      });
  });

browser.storage.local.get('preferences').then(result=> {
  console.log("Root",window.tabs,result.preferences,NODE_ENV);
  window.activeTabs = render(<ActiveTabs tabs={window.tabs} preferences={result.preferences} />, document.querySelector("#root"));
  console.log("tabapp",result.preferences);
});
