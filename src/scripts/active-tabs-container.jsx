let env = require("../../utils/env");
let client = env.browserClient == "firefox" ? browser : chrome;
window.homepageOpened = null;

//Scripts and Modules
//Vendors
// const $ = (jQuery = require('jquery'));
const bootstrap = require("bootstrap");

// import offCanvasNav from "./vendor/codedrops/sidebarEffects";
import React, { Component } from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";

//JS libraries
// import packagedAndBroadcast from './components/communications.js';
import {
  updateTabs,
  getTabs,
  setTabCountInBadge,
} from "./components/browserActions";
import * as general from "./components/general.js";
// import selectTab from './components/tabSelection.js';
// require("./components/general.js");

// React Components
// import Navigation from './react-components/navigation.rc.js';
import TabsGroup from "./components/Accordion/TabsGroup";
// import InfoModal from './react-components/info-modal.js';
// import { getReadingLists, setReadingLists } from "./components/readingList.jsx";

//Styles
// import "../styles/bootstrap/functions";
// import "../styles/bootstrap/variables";
// import '../styles/bootstrap.scss';
import "../styles/fontawesome5/fa-solid.scss";
import "../styles/fontawesome5.scss";
import "../styles/eg.scss";
// import "../styles/codedrops/component.scss";

//Images
import "../images/logo.svg";
import "../images/dev-logo.svg";
import "../images/arrange.svg";
import "../images/close-icon.svg";
import "../images/info-icon.svg";
import "../images/pin-icon.svg";
import "../images/reload-icon.svg";
import "../images/search-icon.svg";
import "../images/sound-icon.svg";

window.tabsList = [];
window.tabsgroup = null;
const menu = document.querySelector(".context-menu");
let menuVisible = false;
const toggleMenu = (command) => {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
};
window.addEventListener("click", (e) => {
  if (menuVisible) toggleMenu("hide");
});
const setPosition = ({ top, left }) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  toggleMenu("show");
};
if (document.addEventListener) {
  document.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
      const origin = {
        left: e.pageX,
        top: e.pageY,
      };
      setPosition(origin);
      return false;
    },
    false
  );
} else {
  document.attachEvent("oncontextmenu", function () {
    alert("You've tried to open context menu");
    window.event.returnValue = false;
  });
}

// NavigationReference = ReactDOM.render(<Navigation />, document.getElementById('navigation'));
// infoModal = ReactDOM.render(<InfoModal />, document.getElementById('infoModal'));
window.tabsgroup = ReactDOM.render(
  <Provider store={store}>
    <TabsGroup />
  </Provider>,
  document.getElementById("active-tabs-list-container")
);

$("#refreshActiveTabs").on("click", updateTabs(window.tabsgroup));
$("#closeSelectedBtn").on("click", (e) => {
  window.tabsgroup.processSelectedTabs("close");
});
