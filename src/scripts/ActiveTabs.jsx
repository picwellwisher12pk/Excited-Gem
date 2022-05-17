import React, { Profiler, useMemo } from "react";
import * as browser from "webextension-polyfill";

import store from "./store";
import { updateActiveTabs } from "./tabSlice";
import { useSelector } from "react-redux";
import { getTabs } from "~/scripts/browserActions";
import { profilerCallback } from "~/scripts/components/general";
import CustomScroll from "react-custom-scroll";

//JS libraries
import "../assets/logo.png";
import "../assets/dev-logo.png";
// React Components
import Header from "./components/Header/Header";
import Search from "./components/Header/Search/Search";
import Navigation from "./components/Header/Navigation";
import TabWindowWrapper from "./TabWindowWrapper";

export function updateTabs(getTabs, store) {
  getTabs(store.getState().tabs.selectedWindow).then((tabs) => {
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

export default function ActiveTabs() {
  const { tabs } = useSelector((state) => state.tabs);
  const { search } = useSelector((state) => state);

  const navigation = useMemo(
    () => <Navigation tabCount={tabs.length} />,
    [tabs.length]
  );
  const header = useMemo(
    () => <Header navigation={navigation} search={<Search />} />,
    [tabs, search]
  );

  return (
    <>
      {header}
      <Profiler id={"TabWindow:"} onRender={profilerCallback}>
        <CustomScroll heightRelativeToParent="100%" keepAtBottom={true}>
          <TabWindowWrapper />
        </CustomScroll>
      </Profiler>
    </>
  );
}
