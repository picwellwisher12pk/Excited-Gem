import {useSelector} from "react-redux";
import React, {useCallback, useEffect, useState} from "react";
import Tab from "./components/Accordion/TabsGroup/Tab";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import {asyncFilterTabs} from "./components/general";

const browser = require("webextension-polyfill");

export const TabWindowWrapper = () => {
  const [loading, setLoading] = useState(true);
  const tabs = useSelector((state) => state.tabs.tabs);
  const searchPref = useSelector((state) => state.config.preferences.search);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const audibleSearch = useSelector((state) => state.search.audibleSearch);
  const pinnedSearch = useSelector((state) => state.search.pinnedSearch);
  const selectedTabs = useSelector((state) => state.tabs.selectedTabs);
  const searchObject = {searchTerm, audibleSearch, pinnedSearch};
  const [filteredTabs, setFilteredTabs] = useState(tabs);

  const findFilteredTabs = async (searchObject, searchPref, tabs, setLoading) => {
    let tempTabs =
      tabs && (await asyncFilterTabs(searchObject, searchPref, tabs));
    window.filteredTabs = tempTabs;
    setFilteredTabs(tempTabs);
    setLoading(false);
  };

  useEffect(async () => {
    if (searchTerm === "" && !audibleSearch && !pinnedSearch) {
      setFilteredTabs(tabs);
    } else {
      setLoading(true);
      findFilteredTabs(searchObject, searchPref, tabs, setLoading);
    }
  }, [searchTerm, audibleSearch, pinnedSearch, tabs]);

  const tabTemplate = (tab, selectedTabs, moveTab) => {
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
  };

  useEffect(() => {
    setLoading(false);
  }, []);
  const moveTab = useCallback(
    (itemId, dragIndex, index) => {
      browser.tabs.move(itemId, {index});
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
      browser.tabs.update(itemId, {muted: !status});
    },
    [tabs]
  );

  const togglePinTab = useCallback(
    (itemId, status) => {
      browser.tabs.pin(itemId, status);
    },
    [tabs]
  );
  return !loading ? (
    <div className="tabs-list-container">
      <DndProvider backend={HTML5Backend}>
        <ul className="tab tabs-list sortable selectable" id={"droppableUL"}>
          {filteredTabs?.length !== undefined &&
          filteredTabs.map((tab) =>
            tabTemplate(tab, selectedTabs, moveTab, closeTab)
          )}
        </ul>
      </DndProvider>
    </div>
  ) : (
    <ClimbingBoxLoader
      color={"#12a3a9"}
      css={{display: "block", margin: "80px auto"}}
      loading={true}
      size={20}
    />
  );
};
