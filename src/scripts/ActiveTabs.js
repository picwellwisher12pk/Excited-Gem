"use strict";
//Scripts and Modules
import store from "./store";
import React from "react";
import {updateActiveTabs} from "./tabSlice";

import {getTabs} from "./components/browserActions";
import CustomScroll from "react-custom-scroll";

//JS libraries
import "../images/logo.png";
import "../images/dev-logo.png";
// React Components
import Header from "./components/Header/Header";
import Search from "./components/Header/Search/Search";
//Styles
import "../styles/eg.scss";
import "react-custom-scroll/dist/customScroll.css";
import {TabWindowWrapper} from "./TabWindowWrapper";
import {asyncFilterTabs} from "./components/general";

const browser = require("webextension-polyfill");

export function updateTabs(getTabs, store) {
  getTabs().then((tabs) => {
    store.dispatch(
      updateActiveTabs(
        tabs.map((tab) => {
          const {
            audible,
            discarded,
            favIconUrl,
            id,
            index,
            mutedInfo,
            pinned,
            status,
            title,
            url,
            windowId,
            groupId,
          } = tab;
          return {
            audible,
            discarded,
            favIconUrl,
            id,
            index,
            mutedInfo,
            pinned,
            status,
            title,
            url,
            groupId,
            windowId,
          };
        })
      )
    );
  });
}

browser.tabs.onRemoved.addListener(() => updateTabs(getTabs, store));
browser.tabs.onDetached.addListener(() => updateTabs(getTabs, store));
browser.tabs.onCreated.addListener(() => updateTabs(getTabs, store));
browser.tabs.onAttached.addListener(() => updateTabs(getTabs, store));
browser.tabs.onUpdated.addListener(() => updateTabs(getTabs, store));
browser.tabs.onMoved.addListener(() => updateTabs(getTabs, store));
updateTabs(getTabs, store);

const ActiveTabs = () => {
console.log('activetab loading');

  return (
    <>
      <Header>
        <Search />
      </Header>
      <CustomScroll heightRelativeToParent="100%" keepAtBottom={true}>
        <TabWindowWrapper/>
      </CustomScroll>
    </>
  );
};

export default ActiveTabs;
