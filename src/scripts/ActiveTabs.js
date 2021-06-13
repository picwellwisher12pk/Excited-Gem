"use strict";
//Scripts and Modules
import store from "./store";
import React, {
  Profiler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { updateActiveTabs } from "./tabSlice";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { asyncFilterTabs, getMetrics } from "./components/general";
import { getTabs } from "./components/browserActions";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CustomScroll from "react-custom-scroll";

//JS libraries
import "../images/logo.png";
import "../images/dev-logo.png";
// React Components
import Header from "./components/Header/Header";
import Search from "./components/Header/Search/Search";
import Tab from "./components/Accordion/TabsGroup/Tab/index";
//Styles
import "../styles/eg.scss";
import "react-custom-scroll/dist/customScroll.css";

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

const TabWindowWrapper = ({ tabs, loading, setLoading }) => {
  const selectedTabs = useSelector((state) => state.tabs.selectedTabs);

  const tabTemplate = useMemo(
    () => (tab, selectedTabs, moveTab) => {
      let selected = false;
      //If current tab.id exists in selectedTabs array
      if (selectedTabs.indexOf(tab.id) >= 0) selected = true;
      return (
        <Tab
          {...tab}
          key={tab.id}
          activeTab={true}
          index={tab.index}
          moveTab={moveTab}
          selected={selected}
          closeTab={closeTab}
          togglePinTab={togglePinTab}
          toggleMuteTab={toggleMuteTab}
        />
      );
    },
    []
  );

  useEffect(() => {
    setLoading(false);
  }, []);
  const moveTab = useCallback(
    (itemId, dragIndex, index) => {
      browser.tabs.move(itemId, { index });
    },
    [tabs]
  );
  const closeTab = useCallback(
    (itemId) => {
      browser.tabs.remove(itemId);
    },
    [tabs]
  );
  const toggleMuteTab = useCallback(
    (itemId, status) => {
      browser.tabs.update(itemId, { muted: !status });
    },
    [tabs]
  );

  const togglePinTab = useCallback(
    (itemId, status) => {
      browser.tabs.pin(itemId, status);
    },
    [tabs]
  );
  const tabsMemo = useMemo(() => {
    return tabs.map((tab) => tabTemplate(tab, selectedTabs, moveTab, closeTab));
  }, [tabs]);
  return !loading ? (
    <div className="tabs-list-container">
      <DndProvider backend={HTML5Backend}>
        <ul className="tab tabs-list sortable selectable" id={"droppableUL"}>
          {tabs.length !== undefined && tabsMemo}
        </ul>
      </DndProvider>
    </div>
  ) : (
    <ClimbingBoxLoader
      color={"#12a3a9"}
      css={{ display: "block", margin: "80px auto" }}
      loading={true}
      size={20}
    />
  );
};

const ActiveTabs = () => {
  const [loading, setLoading] = useState(true);
  const tabs = useSelector((state) => state.tabs.tabs);
  const searchPref = useSelector((state) => state.config.preferences.search);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const [filteredTabs, setFilteredTabs] = useState(tabs);

  const findFilteredTabs = useMemo(
    () => async (searchTerm, searchPref, tabs, setLoading) => {
      let tempTabs = await asyncFilterTabs(searchTerm, searchPref, tabs);
      window.filteredTabs = tempTabs;
      setFilteredTabs(tempTabs);
      setLoading(false);
    },
    [searchTerm, searchPref, tabs]
  );
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredTabs(tabs);
    } else {
      setLoading(true);
      findFilteredTabs(searchTerm, searchPref, tabs, setLoading);
    }
  }, [searchTerm, tabs]);
  return (
    <Profiler id={"app"} onRender={getMetrics}>
      <Header>
        <Search />
      </Header>
      <CustomScroll heightRelativeToParent="100%" keepAtBottom={true}>
        <TabWindowWrapper
          tabs={filteredTabs}
          loading={loading}
          setLoading={setLoading}
        />
      </CustomScroll>
    </Profiler>
  );
};

export default ActiveTabs;
