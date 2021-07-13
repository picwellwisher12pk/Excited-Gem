"use strict";
//Scripts and Modules
import store from "./store";
import React, { Profiler, useMemo } from "react";
import { updateActiveTabs } from "./tabSlice";
import { useSelector } from "react-redux";
import { getTabs } from "./components/browserActions";
import { profilerCallback } from "./components/general";
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
import { Navigation } from "./components/Header/Navigation";
import { TabWindowWrapper } from "./TabWindowWrapper";

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
          if (url)
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
  const { tabs } = useSelector((state) => state.tabs);
  const { search } = useSelector((state) => state);
  const navigation = useMemo(() => <Navigation tabCount={tabs.length} />, [
    tabs.length,
  ]);
  const header = useMemo(
    () => <Header navigation={navigation} search={<Search />} />,
    [tabs, search]
  );
  console.log("activetab loading");

  return (
    <>
      {header}
      <CustomScroll heightRelativeToParent="100%" keepAtBottom={true}>
        <Profiler id={"TabWindow:"} onRender={profilerCallback}>
          <TabWindowWrapper />
        </Profiler>
      </CustomScroll>
    </>
  );
};

export default ActiveTabs;
