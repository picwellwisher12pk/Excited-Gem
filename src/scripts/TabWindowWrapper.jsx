import { useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import Tab from "~/scripts/components/Accordion/TabsGroup/Tab";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { asyncFilterTabs } from "~/scripts/components/general";

import browser from "webextension-polyfill";

export const TabWindowWrapper = React.memo(() => {
  const [loading, setLoading] = useState(true);
  const tabs = useSelector((state) => state.tabs.tabs);
  const { ignoreCase, regex } = useSelector((state) => state.config.search);
  const searchObject = useSelector((state) => state.search);
  const searchPref = { ignoreCase, regex };
  const selectedTabs = useSelector((state) => state.tabs.selectedTabs);
  const [filteredTabs, setFilteredTabs] = useState(tabs);

  const findFilteredTabs = async (
    searchObject,
    searchPref,
    tabs,
    setLoading
  ) => {
    if (!searchObject.searchTerm) {
      setLoading(false);
      setFilteredTabs(tabs);
      return;
    }
    const tempTabs =
      tabs && (await asyncFilterTabs(searchObject, searchPref, tabs));
    // window.filteredTabs = tempTabs;
    setFilteredTabs(tempTabs);
    setLoading(false);
  };

  useEffect(async () => {
    if (
      searchObject.searchTerm === "" &&
      !searchObject.audibleSearch &&
      !searchObject.pinnedSearch
    ) {
      setFilteredTabs(tabs);
    } else {
      setLoading(true);
      findFilteredTabs(searchObject, searchPref, tabs, setLoading);
    }
  }, [searchObject, tabs]);

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
  return !loading ? (
    <div className="tabs-list-container">
      <React.Suspense fallback={<h1>Loading profile...</h1>}>
        <DndProvider backend={HTML5Backend}>
          <ul className="tab tabs-list sortable selectable" id={"droppableUL"}>
            {filteredTabs?.length !== undefined &&
              filteredTabs.map((tab) =>
                tabTemplate(tab, selectedTabs, moveTab, closeTab)
              )}
          </ul>
        </DndProvider>
      </React.Suspense>
    </div>
  ) : (
    <ClimbingBoxLoader
      color={"#12a3a9"}
      css={{ display: "block", margin: "80px auto" }}
      loading={true}
      size={20}
    />
  );
});
