import { useSelector } from "react-redux";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Tab from "~/scripts/components/Accordion/TabsGroup/Tab";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { asyncFilterTabs } from "~/scripts/components/general";
import ContentLoader from "react-content-loader";

const MyLoader = (props) => (
  <ContentLoader
    speed={1}
    width={props.width}
    height={500}
    viewBox={"0 0 " + props.width + " 500"}
    backgroundColor="#e3e3e3"
    foregroundColor="#ecebeb"
    {...props}
  >
    {[...Array(10)].map((_, i) => {
      const height = 20;
      const radius = height / 2;
      return (
        <>
          <rect
            x="10"
            y={15 + i * 40}
            width={height}
            height={height}
            rx={5}
            ry={5}
          />
          <rect
            x={height + 20}
            y={15 + i * 40}
            rx={5}
            ry={5}
            width={props.width - height - 50}
            height={height}
          />
        </>
      );
    })}
  </ContentLoader>
);
import browser from "webextension-polyfill";

const TabWindowWrapper = React.memo(() => {
  const [width, setWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const { tabs } = useSelector((state) => state.tabs);
  const { ignoreCase, regex } = useSelector((state) => state.search);
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
  useLayoutEffect(() => {
    const newWidth = document.body.offsetWidth;
    console.log(newWidth);
    setWidth(newWidth);
  });
  useEffect(() => {
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
    <MyLoader width={width} />
  );
});

export default TabWindowWrapper;
