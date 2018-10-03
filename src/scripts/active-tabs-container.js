console.log("testing");
let env = require('../../utils/env');
let client =  env.browserClient == 'firefox' ? browser : chrome;
window.homepageOpened = null;

//Scripts and Modules
//Vendors
// const $ = (jQuery = require('jquery'));
const bootstrap = require('bootstrap');

// import offCanvasNav from "./vendor/codedrops/sidebarEffects";
import React from 'react';
import 'react-devtools';
import ReactDOM from 'react-dom';

//JS libraries
// import packagedAndBroadcast from './components/communications.js';
import {updateTabs,getTabs,setTabCountInBadge} from './components/browserActions';
import * as general from './components/general.js';
// import selectTab from './components/tabSelection.js';
// require("./components/general.js");

// React Components
// import Navigation from './react-components/navigation.rc.js';
import TabsGroup from './components/TabsGroup';
// import InfoModal from './react-components/info-modal.js';
// import { getReadingLists, setReadingLists } from "./components/readingList.jsx";

//Styles
import '../styles/bootstrap.scss';
import '../styles/fontawesome5/fa-solid.scss';
import '../styles/fontawesome5.scss';
import '../styles/eg.scss';
// import "../styles/codedrops/component.scss";

//Images
import '../images/logo.svg';
import '../images/dev-logo.svg';
import '../images/arrange.svg';
import '../images/close-icon.svg';
import '../images/info-icon.svg';
import '../images/pin-icon.svg';
import '../images/reload-icon.svg';
import '../images/search-icon.svg';
import '../images/sound-icon.svg';

//Declarations
// const sender = 'content';
// let currentPage = '';
// let windowHeight;
// let NavigationReference;
// let infoModal;
let pref = {
  filterType: 'regex',
  filterCase: 'true',
  windowType: 'current'
};
window.tabsList = [];
window.tabsgroup = null;

//Browser Events
client.runtime.onInstalled.addListener(() => {
  console.log("Excited Gem Installed !");
});
client.tabs.onRemoved.addListener(
  (tabId) => {
    console.log(tabId," closing");
    setTabCountInBadge(tabId, true);
    getTabs().then(tabs => {  console.log("after tab closing:",tabs);window.tabsgroup.setState({tabs}) });
  });
client.tabs.onCreated.addListener(
  (tabId) => {
    setTabCountInBadge(tabId, false);
    getTabs().then(tabs => {  window.tabsgroup.setState({tabs}) });
  });
client.tabs.onAttached.addListener(
  (tabId) => {
    setTabCountInBadge(tabId, true);
    getTabs().then(tabs => {  window.tabsgroup.setState({tabs}) });
  });
client.tabs.onDetached.addListener(
  (tabId) => {setTabCountInBadge(tabId, true);
    getTabs().then(tabs => {  window.tabsgroup.setState({tabs}) });
  });
client.tabs.onUpdated.addListener(
  (tabId,changeInfo, tabInfo) => {
    console.log(tabId," being Updated",changeInfo,tabInfo);
    getTabs().then(tabs => {
      console.log("updating", tabs);
      window.tabsgroup.setState({tabs});
    })
  });
setTabCountInBadge();

// NavigationReference = ReactDOM.render(<Navigation />, document.getElementById('navigation'));
// infoModal = ReactDOM.render(<InfoModal />, document.getElementById('infoModal'));
window.tabsgroup = ReactDOM.render(<TabsGroup />, document.getElementById('active-tabs-list-container'));

//Search/Filter
$('#quicksearch-input').keyup( e => {
  console.log("active-tabs-container.js:Search:");
  let filteredTabs = general.searchInTabs(e.target.value, window.tabsList);
  window.tabsgroup.setState({ tabs: filteredTabs });
});
$('#allWindows').click(e =>{
  pref.windowType = 'All';
  updateTabs( window.tabsgroup);
});
$('#currentWindow').click(e =>{
  pref.windowType = 'current';
  updateTabs( window.tabsgroup);
});



$('#refreshActiveTabs').on('click', updateTabs( window.tabsgroup));
$('#closeSelectedBtn').on('click', (e)=>{
  window.tabsgroup.processSelectedTabs('close');
});
// Sorting of Tabs (Title | URL). Event Binding
$('#rearrange-title-btn').on('click', () => general.sortTabs('title', window.tabsList));
$('#rearrange-url-btn').on('click', () => general.sortTabs('url', window.tabsList));
