import React, { Profiler, useState } from "react";
import { getMetrics, sortTabs } from "../general.js";
import VolumeIcon from "~/icons/volume.svg?component";
import VolumeSlashIcon from "~/icons/volume-mute.svg?component";
import TimesIcon from "~/icons/times.svg?component";
import SortIcon from "~/icons/sort.svg?component";
import SaveIcon from "~/icons/save.svg?component";
import SyncAltIcon from "~/icons/sync-alt.svg?component";
import ThumbtackIcon from "~/icons/thumbtack-active.svg?component";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedTabs } from "../../tabSlice.js";

import Brand from "./Brand";
import WindowSelector from "../WindowSelector";

import browser from "webextension-polyfill";

//Images
import logo from "~/assets/logo.png";
import { Button, Checkbox, Dropdown, Menu, Space } from "antd";

const Header = (props) => {
  console.log("header loading", props);
  const dispatch = useDispatch();
  const selectedTabs = useSelector((state) => state.tabs.selectedTabs);
  const [allSelected, setAllSelected] = useState(props.allSelected);
  const [allPinned, setAllPinned] = useState(props.allPinned);
  const [allMuted, setAllMuted] = useState(props.allMuted);
  const { navigation, search } = props;
  const sortBy = (sortType) => {
    sortTabs(sortType, tabs);
  };
  let iconPinned = props.allPinned && (
    <ThumbtackIcon style={{ height: 16, fill: "white" }} />
  );
  let iconSound = props.allMuted ? (
    <VolumeIcon style={{ height: 16, fill: "white" }} />
  ) : (
    <VolumeSlashIcon style={{ height: 16, fill: "white" }} />
  );
  browser.windows.getCurrent({ populate: true }).then((window) => {
    // setCurrentWindow(window);
  });
  const sortMenu = (
    <Menu
      items={[
        {
          label: <Button type="link">by Title</Button>,
          key: "0",
        },
        {
          label: <Button type="link">by URL</Button>,
          key: "1",
        },
      ]}
    />
  );
  const pinMenu = (
    <Menu
      items={[
        {
          label: <Button type="link">Toggle Pin/Unpin</Button>,
          key: "0",
        },
        {
          label: <Button type="link">Pin</Button>,
          key: "1",
        },
        {
          label: <Button type="link">Unpin</Button>,
          key: "1",
        },
      ]}
    />
  );
  const muteMenu = (
    <Menu
      items={[
        {
          label: <Button type="link">Toggle Mute/Unmute</Button>,
          key: "0",
        },
        {
          label: <Button type="link">Mute</Button>,
          key: "1",
        },
        {
          label: <Button type="link">Unmute</Button>,
          key: "1",
        },
      ]}
    />
  );
  return (
    <Profiler id={"header"} onRender={getMetrics}>
      <header
        className="bg-gradient-to-t from-cyan-500 to-blue-500 p-2"
        key={"header"}
      >
        <div className="flex">
          {Brand(logo)}
          {navigation}
          {search}
        </div>
        <section
          className="flex flex-row justify-between items-center mt-3"
          id="selection-action"
        >
          <ul className="flex mb-0">
            <li className="mr-5">
              <label
                className="text-white"
                onClick={() => {
                  props.processSelectedTabs(
                    allSelected ? "selectAll" : "selectNone",
                    props.tabs.map((tab) => tab.id)
                  );
                  setAllSelected(!allSelected);
                }}
                title="Select All"
              >
                <Checkbox defaultChecked={props.allSelected} />{" "}
                <span className="pl-1">Select All</span>
              </label>
            </li>
            <li>
              <Dropdown overlay={sortMenu} arrow={{ pointAtCenter: true }}>
                <button onClick={(e) => e.preventDefault()}>
                  <SortIcon
                    className="inline"
                    style={{ height: 12, width: 14 }}
                  />{" "}
                  <span className="text-white">Sort Tabs</span>
                </button>
              </Dropdown>
            </li>
            <li>
              <WindowSelector key={"windowSelector"} />
            </li>
          </ul>
          <div className={`flex ` + (selectedTabs.length > 0 && "hidden")}>
            <strong className="text-yellow-300">With Selected </strong>
            <div>
              <Dropdown overlay={pinMenu} arrow={{ pointAtCenter: true }}>
                <a
                  onClick={(e) => e.preventDefault()}
                  className="text-white hover:text-white hover:fill-yellow-500 ml-5"
                >
                  <Space>
                    <ThumbtackIcon
                      style={{ height: 12, fill: "white" }}
                      className="fill-inherit"
                    />
                    Pin/Unpin
                  </Space>
                </a>
              </Dropdown>
            </div>
            <div>
              <Dropdown overlay={muteMenu} arrow={{ pointAtCenter: true }}>
                <a
                  onClick={(e) => e.preventDefault()}
                  className="text-white hover:text-white hover:fill-yellow-500 ml-5"
                >
                  <Space>
                    <VolumeIcon
                      style={{ height: 12, fill: "white" }}
                      className="fill-inherit"
                    />
                    Mute/Unmute
                  </Space>
                </a>
              </Dropdown>
            </div>

            <div>
              <button
                title="Close Selected"
                onClick={() => props.processSelectedTabs("closeSelected")}
                className="ml-5"
              >
                <TimesIcon
                  style={{ height: 16, width: 14, fill: "white" }}
                  className="inline"
                />
                <span className="text-white"> Close</span>
              </button>
            </div>
            <div>
              <button
                className="btn btn-default ml-5"
                onClick={() => props.processSelectedTabs("toSession")}
              >
                <SaveIcon
                  style={{ height: 16, width: 14, fill: "white" }}
                  className="inline"
                />
                <span className="text-white"> Save</span>
              </button>
            </div>
            <div className={"input-group-append"}>
              {/* <button
                className="btn btn-default"
                onClick={() => props.processSelectedTabs("toNewWindow")}
              >
                <FA icon={faShareSquare} />
              </button> */}
            </div>
          </div>
          <ul className="flex mb-0">
            <li>
              <button
                className="bg-transparent refreshActiveTabs"
                title="Refresh Excited Gem Tabs"
                onClick={() => {
                  // updateTabs();
                  // this.setState({ tabs: props.tabs });
                }}
                style={{ minWidth: 33 }}
              >
                <SyncAltIcon style={{ height: 16, fill: "white" }} />
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  props.processSelectedTabs(
                    !props.allPinned ? "pinSelected" : "unpinSelected",
                    this.filterTabs().map((tab) => tab.id)
                  );
                  setAllPinned(!allPinned);
                }}
                title={!props.allPinned ? `Pin All` : `Unpin All`}
                className="btn btn-sm bg-transparent"
              >
                {iconPinned}
              </button>
            </li>
            <li>
              <button
                className="btn btn-sm bg-transparent "
                onClick={() => {
                  props.processSelectedTabs(
                    !props.allMuted ? "muteSelected" : "unmuteSelected",
                    this.filterTabs().map((tab) => tab.id)
                  );
                  this.setState({ allMuted: !props.allMuted });
                }}
                title={!props.allMuted ? `Mute All` : `Unmute All`}
                style={{ minWidth: 33 }}
              >
                {iconSound}
              </button>
            </li>
            <li>
              <button
                title="Close All"
                className="btn btn-sm bg-transparent"
                onClick={() => {
                  let ids =
                    selectedTabs.length === 0
                      ? window.filteredTabs.map((tab) => tab.id)
                      : selectedTabs;
                  dispatch(clearSelectedTabs());
                  browser.tabs.remove(ids);
                }}
              >
                <TimesIcon style={{ height: 16, fill: "white" }} />
              </button>
            </li>
          </ul>
        </section>
      </header>
    </Profiler>
  );
};

export default Header;
