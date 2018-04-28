//Scripts and Modules
//Vendors
// const $ = (jQuery = require('jquery'));
const bootstrap = require('bootstrap');

// import offCanvasNav from "./vendor/codedrops/sidebarEffects";
function React() {
  return import(/* webpackChunkName: "react" */ 'react').then(react => react);
}
import 'react-devtools';
import { render } from 'react-dom';
React();
//JS components
// import packagedAndBroadcast from './components/communications.js';
import * as general from './components/general.js';
import selectTab from './components/tabSelection.js';
// require("./components/general.js");

// React Components
import Navigation from './react-components/navigation.rc.js';
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
let NavigationReference;
let infoModal;
let pref = {
  filterType: 'regex',
  filterCase: 'true',
};
let client = browser;
let tabsList;
let tabsgroup;

function updateTabs() {
  getCurrentWindowTabs().then(tabs => {
    tabsList = tabs;
    tabsgroup.setState({ tabs: tabs });
    $('.active-tab-counter').text(tabs.length);
  });
}

function getCurrentWindowTabs() {
  return browser.tabs.query({ currentWindow: true });
}
// tabsgroup.forceUpdate();
client.tabs.onRemoved.addListener(updateTabs);
client.tabs.onAttached.addListener(updateTabs);
client.tabs.onUpdated.addListener(updateTabs);
client.tabs.onUpdated.addListener(function(tabId, info) {
  console.log('onExtension page on updated event', tabId, info);
  updateTabs();
});

tabsgroup = render(<TabsGroup />, document.getElementById('active-tabs-list-container'));
client.tabs.query({}, tabs => {
  $('.active-tab-counter').text(tabs.length);
});

NavigationReference = render(<Navigation />, document.getElementById('navigation'));
infoModal = render(<InfoModal />, document.getElementById('infoModal'));

//Seach/Filter
$('#quicksearch-input').on('keyup', e => {
  let filteredTabs = general.searchInTabs(e.target.value, tabsList);
  tabsgroup.setState({ tabs: filteredTabs });
});
$('#refreshActiveTabs').on('click', updateTabs);
// Sorting of Tabs (Title | URL). Event Binding
$('#rearrange-title-btn').on('click', () => general.sortTabs('title', tabsList));
$('#rearrange-url-btn').on('click', () => general.sortTabs('url', tabsList));
