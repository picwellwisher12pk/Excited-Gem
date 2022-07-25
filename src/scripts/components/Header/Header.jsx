import React, { Profiler, useEffect, useState } from "react";
import { getMetrics, processTabs, sortTabs } from "../general.js";
import VolumeIcon from "~/icons/volume.svg?component";
import VolumeOffIcon from "~/icons/volume-off.svg?component";
import VolumeSlashIcon from "~/icons/volume-mute.svg?component";
import TimesIcon from "~/icons/times.svg?component";
import SortIcon from "~/icons/sort.svg?component";
import SaveIcon from "~/icons/save.svg?component";
import SyncAltIcon from "~/icons/sync-alt.svg?component";
import ThumbtackIcon from "~/icons/thumbtack-active.svg?component";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedTabs } from "../../tabSlice.js";
import { LoadingOutlined } from "@ant-design/icons";
import Brand from "./Brand";
import WindowSelector from "../WindowSelector";
import { getAllWindows, getCurrentWindow } from "~/scripts/browserActions";
import browser from "webextension-polyfill";

//Images
import logo from "~/assets/logo.png";
import { Button, Dropdown, Menu, Select, Space } from "antd";
import { MoveModal } from "../Modals/Move.jsx";
import { SaveModal } from "../Modals/Save.jsx";
const { Option } = Select;

const Header = (props) => {
  console.log("header loading", props);
  const dispatch = useDispatch();
  const { selectedTabs, tabs, filteredTabs } = useSelector(
    (state) => state.tabs
  );
  const { navigation, search } = props;
  const [allSelected, setAllSelected] = useState(props.allSelected);
  const [allMuted, setAllMuted] = useState(props.allMuted);
  const [sorting, setSorting] = useState(false);
  const [allWindows, setAllWindows] = useState([]);
  const [currentWindow, setCurrentWindow] = useState({});
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  async function getWindows() {
    setAllWindows(await getAllWindows());
    setCurrentWindow(await getCurrentWindow());
  }
  const [modal, setModal] = useState({
    title: null,
    content: null,
    isVisible: false,
  });

  useEffect(() => {
    getWindows();
  }, []);

  let iconPinned = props.allPinned && (
    <ThumbtackIcon style={{ height: 16, fill: "white" }} />
  );
  let iconSound = <VolumeSlashIcon style={{ height: 16 }} />;

  browser.windows.getCurrent({ populate: true }).then((window) => {
    // setCurrentWindow(window);
  });
  const sortMenu = (
    <Menu
      items={[
        {
          label: (
            <Button
              type="link"
              onClick={async () => {
                setSorting(true);
                await sortTabs("title", tabs);
                setSorting(false);
              }}
            >
              by Title
            </Button>
          ),
          key: "0",
        },
        {
          label: (
            <Button
              type="link"
              onClick={async () => {
                setSorting(true);
                await sortTabs("url", tabs);
                setSorting(false);
              }}
            >
              by URL
            </Button>
          ),
          key: "1",
        },
      ]}
    />
  );
  const pinMenu = (
    <Menu
      items={[
        {
          label: (
            <Button
              type="link"
              onClick={() => {
                processTabs("togglePinSelected", selectedTabs, tabs);
              }}
            >
              Toggle Pin/Unpin
            </Button>
          ),
          key: "0",
        },
        {
          label: (
            <Button
              type="link"
              onClick={() => {
                processTabs("pinSelected", selectedTabs, tabs);
              }}
            >
              Pin
            </Button>
          ),
          key: "1",
        },
        {
          label: (
            <Button
              type="link"
              onClick={() => {
                processTabs("unpinSelected", selectedTabs, tabs);
              }}
            >
              Unpin
            </Button>
          ),
          key: "2",
        },
      ]}
    />
  );
  const muteMenu = (
    <Menu
      items={[
        {
          label: (
            <Button
              type="link"
              onClick={() => {
                processTabs("toggleMuteSelected", selectedTabs, tabs);
              }}
            >
              Toggle Mute/Unmute
            </Button>
          ),
          key: "0",
        },
        {
          label: (
            <Button
              type="link"
              onClick={() => {
                processTabs("muteSelected", selectedTabs, tabs);
              }}
            >
              Mute
            </Button>
          ),
          key: "1",
        },
        {
          label: (
            <Button
              type="link"
              onClick={() => {
                processTabs("unmuteSelected", selectedTabs, tabs);
              }}
            >
              Unmute
            </Button>
          ),
          key: "2",
        },
      ]}
    />
  );
  let sortingIcon = sorting ? (
    <LoadingOutlined />
  ) : (
    <SortIcon className="!fill-slate-700" style={{ height: 12, width: 14 }} />
  );
  return (
    <Profiler id={"header"} onRender={getMetrics}>
      <header
        className="bg-gradient-to-t from-cyan-500 to-blue-500 p-2 transition-all duration-200 ease-in-out"
        key={"header"}
      >
        <div className="flex">
          {Brand(logo)}
          {navigation}
          {search}
        </div>
        <section
          className="flex flex-row justify-between items-center mt-1"
          id="selection-action"
        >
          <ul className="flex mb-0">
            <li className="mr-3">
              <div className="flex shadow-md">
                <span className="bg-zinc-200 py-[4px] px-2 rounded-l-[2px] text-black select-none">
                  Select
                </span>
                <Button className="!px-2 !border-0 !rounded-none !bg-gradient-to-b !from-white !to-slate-200 !transition">
                  All
                </Button>
                <Button className="!px-2 !border-0 !rounded-none !bg-gradient-to-b !from-white !to-slate-200  transition">
                  None
                </Button>
                <Button className="!px-2 !border-0 !rounded-l-none !bg-gradient-to-b !from-white !to-slate-200  transition">
                  Invert
                </Button>
              </div>
              {/* <label
                className="text-white"
                onClick={() => {
                  props.processSelectedTabs(
                    allSelected ? "selectAll" : "selectNone",
                    filteredTabs.map((tab) => tab.id)
                  );
                  setAllSelected(!allSelected);
                }}
                title="Select All"
              >
                <Checkbox defaultChecked={props.allSelected} />{" "}
                <Badge
                  title="Selected Tabs count"
                  className="pl-1"
                  overflowCount={999}
                  count={selectedTabs?.length}
                  color={"green "}
                  size="small"
                >
                  <span className="pl-1 cursor-pointer text-white">
                    Select All
                  </span>
                </Badge>
              </label> */}
            </li>
            <li>
              <Dropdown overlay={sortMenu} className="mr-3">
                <button
                  onClick={(e) => e.preventDefault()}
                  className="ant-btn !border-0 !shadow-md !hover:shadow-sm !bg-gradient-to-b !from-white !to-slate-200"
                >
                  <Space>
                    {sortingIcon}
                    <span>Sort</span>
                  </Space>
                </button>
              </Dropdown>
            </li>
            <li>
              {allWindows.length > 1 && (
                <WindowSelector
                  key={"windowSelector"}
                  allWindows={allWindows}
                  currentWindow={currentWindow}
                />
              )}
            </li>
          </ul>
          {selectedTabs.length > 0 && (
            <section className={`flex text-white`}>
              {/* <Select defaultValue={"selected"} className="!border-0 !mr-2">
                <Option value="selected">With selected</Option>
                <Option value="filtered">With Filtered</Option>
              </Select> */}
              <span className="px-2 pl-0 text-white select-none font-semibold">
                With Selected ({selectedTabs.length})
              </span>
              <div>
                <Dropdown overlay={pinMenu} arrow={true}>
                  <button
                    // onClick={(e) => e.preventDefault()}
                    className="ant-btn !px-2 !border-0 !bg-gradient-to-b !from-white !to-slate-200  !hover:text-black !transition mr-2 ant-btn-sm"
                  >
                    {/* <ThumbtackIcon
                    style={{ height: 12 }}
                    className="fill-inherit"
                  /> */}
                    Un/Pin <small style={{ fontSize: 8 }}>▼</small>
                  </button>
                </Dropdown>
              </div>
              <div>
                <Dropdown overlay={muteMenu} arrow={true}>
                  <button className="ant-btn !px-2 !border-0 mr-2 !bg-gradient-to-b !from-white !to-slate-200 !hover:to-white  !hover:text-black !transition ant-btn-sm">
                    {/* <VolumeIcon style={{ height: 12 }} className="fill-inherit" /> */}
                    Un/Mute <small style={{ fontSize: 8 }}>▼</small>
                  </button>
                </Dropdown>
              </div>
              <div>
                <button
                  className="ant-btn !px-2 !border-0 mr-2 !bg-gradient-to-b !from-white !to-slate-200 !hover:to-white  !hover:text-black !transition ant-btn-sm"
                  onClick={() => {
                    setSaveModalVisible(true);
                  }}
                >
                  {/* <SaveIcon
                  style={{ height: 12, width: 14 }}
                  className="inline"
                /> */}
                  <span> Save ...</span>
                </button>
              </div>

              <div>
                <button
                  title="Move Selected Tabs"
                  onClick={() => {
                    setMoveModalVisible(true);
                  }}
                  className="ant-btn !px-2 !border-0 !bg-gradient-to-b !from-white !to-slate-200  !hover:text-black !transition mr-2  ant-btn-sm"
                >
                  {/* <TimesIcon style={{ height: 14, width: 14, fill: "red" }} /> */}
                  <Space>
                    <span>Move ...</span>
                  </Space>
                </button>
              </div>
              <div>
                <button
                  title="Close Selected"
                  onClick={() => {
                    processTabs("closeSelected", selectedTabs, tabs, () => {
                      dispatch(clearSelectedTabs());
                    });
                  }}
                  className="ant-btn !px-2 !border-0 !bg-gradient-to-b !from-white !to-slate-200  !hover:text-black !transition mr-2 !text-red-600 ant-btn-sm"
                >
                  {/* <TimesIcon style={{ height: 14, width: 14, fill: "red" }} /> */}
                  <span> Close</span>
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
            </section>
          )}
          <ul className="flex mb-0">
            <li>
              <button
                className="ant-btn !border-0 !shadow-md !hover:shadow-sm !bg-gradient-to-b !from-white !to-slate-200"
                title="Refresh View"
                onClick={() => {
                  // updateTabs();
                  // this.setState({ tabs: props.tabs });
                }}
                style={{ minWidth: 33 }}
              >
                <SyncAltIcon style={{ height: 16 }} />
              </button>
            </li>

            <li>
              <button
                className="ant-btn !border-0 !shadow-md !hover:shadow-sm !bg-gradient-to-b !from-white !to-slate-200 ml-2"
                onClick={() => {
                  props.processSelectedTabs(
                    !props.allMuted ? "muteSelected" : "unmuteSelected"
                    // filterTabs().map((tab) => tab.id)
                  );
                  // setState({ allMuted: !props.allMuted });
                }}
                title={
                  !props.allMuted
                    ? `Mute All Visible Tabs`
                    : `Unmute All Visible Tabs`
                }
              >
                {iconSound}
              </button>
            </li>
          </ul>
        </section>
        {moveModalVisible && (
          <MoveModal
            selectedTabs={selectedTabs}
            windows={allWindows}
            currentWindow={currentWindow}
            setMoveModalVisible={setMoveModalVisible}
          />
        )}
        {saveModalVisible && (
          <SaveModal
            selectedTabs={selectedTabs}
            setSaveModalVisible={setSaveModalVisible}
          />
        )}
      </header>
    </Profiler>
  );
};

export default Header;
