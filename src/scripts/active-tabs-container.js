let env = require('../../utils/env');
let client =  env.browserClient == 'firefox' ? browser : chrome;

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
import {getCurrentWindowTabs,getAllWindowTabs} from './components/browserActions';
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

function updateTabs() {
  let result = pref.windowType == 'current' ? getCurrentWindowTabs() : getAllWindowTabs();
  result.then(tabs => {
      window.tabsList = tabs;
      window.tabsgroup.setState({tabs: window.tabsList} );
      $('.active-tab-counter').text(tabs.length);
      $('#allWindows span.count').text(tabs.length);

      $('#currentWindow span.count').text(tabs.length);
      if (tabs.length >= 50)  $('#currentWindow span.count, #allWindows span.count').toggleClass('label-success label-warning');
      if (tabs.length >= 100)  $('#currentWindow span.count, #allWindows span.count').toggleClass('label-success label-danger');
      });
}

client.tabs.onRemoved.addListener(updateTabs);
client.tabs.onAttached.addListener(updateTabs);
client.tabs.onUpdated.addListener(updateTabs);


// NavigationReference = ReactDOM.render(<Navigation />, document.getElementById('navigation'));
// infoModal = ReactDOM.render(<InfoModal />, document.getElementById('infoModal'));
window.tabsgroup = ReactDOM.render(<TabsGroup />, document.getElementById('active-tabs-list-container'));
//Seach/Filter

$('#quicksearch-input').keyup( e => {
  console.log("active-tabs-container.js:Search:");
  let filteredTabs = general.searchInTabs(e.target.value, window.tabsList);
  window.tabsgroup.setState({ tabs: filteredTabs });
});
$('#allWindows').click(e =>{
  pref.windowType = 'All';
  updateTabs();
});
$('#currentWindow').click(e =>{
  pref.windowType = 'current';
  updateTabs();
});



$('#refreshActiveTabs').on('click', updateTabs);
$('#closeSelectedBtn').on('click', (e)=>{
  window.tabsgroup.processSelectedTabs('close');
});
// Sorting of Tabs (Title | URL). Event Binding
$('#rearrange-title-btn').on('click', () => general.sortTabs('title', window.tabsList));
$('#rearrange-url-btn').on('click', () => general.sortTabs('url', window.tabsList));
