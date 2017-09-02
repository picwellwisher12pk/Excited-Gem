//Scripts and Modules
// import $ from 'jquery';
import "../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js";
import packageAndBroadcast from "./components/communications";
import ActiveTabs from "./react-components/activetabs";
import {getReadingLists,setReadingLists} from "./components/readingList";

//Styles
import "bootstrap";
import "../styles/eg.scss";

//Declarations
let windowHeight;
const sender = "content";
let tabsList;
let activeTabsCount;
let selectedTabIndex;
let currentPage = "";
let currentURL ;




$(document).ready(function() {
  getReadingLists();
  currentURL = window.location.pathname;
  getCurrentURL();
  packageAndBroadcast(sender, 'background', 'documentready', null); //Tells background page when front-page's DOM is ready to start communication
  $('.active-tab-counter').text(activeTabsCount);
});
