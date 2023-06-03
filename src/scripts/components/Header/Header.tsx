import { LoadingOutlined } from "@ant-design/icons"
import { Button, Dropdown, Menu, Select, Space } from "antd"
import { Checkbox } from "antd"
import { Profiler, useEffect, useState,useRef,memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import SaveIcon from "/src/icons/save.svg"
import SortIcon from "react:/src/icons/sort.svg"

import SyncAltIcon from "react:/src/icons/sync-alt.svg"
import ThumbtackIcon from "react:/src/icons/thumbtack-active.svg"

import VolumeSlashIcon from "react:/src/icons/volume-mute.svg"

import { getAllWindows, getCurrentWindow } from "/src/scripts/browserActions"

import { getMetrics, processTabs, sortTabs } from "../general"
import {
  clearSelectedTabs,
  invertSelectedTabs,
  selectAllTabs
} from "../tabSlice.js"
import Brand from "./Header/Brand.jsx"
import { MoveModal } from "./Modals/Move.jsx"
import { SaveModal } from "./Modals/Save.jsx"
import WindowSelector from "./WindowSelector.jsx"
//Images
import logo from "/public/logo.png"

// import TimesIcon from "react:~/icons/times.svg"

// import VolumeOffIcon from "react:~/icons/volume-off.svg"
// import VolumeIcon from "react:~/icons/volume.svg"

export function getCurrentWindow() {
  return chrome.windows.getCurrent({ populate: true })
}
export function getAllWindows() {
  return chrome.windows.getAll({
    populate: true,
    windowTypes: ["normal"]
  })
}

const { Option } = Select
function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}
const Header = memo((props) => {
  console.log("header loading", props)
  const dispatch = useDispatch()
  const { selectedTabs, tabs, filteredTabs } = useSelector(
    (state) => state.tabs
  )
  const [checkedList, setCheckedList] = useState(selectedTabs)
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)

  const { navigation, search } = props
  const [allSelected, setAllSelected] = useState(props.allSelected)
  const [allMuted, setAllMuted] = useState(props.allMuted)
  const [sorting, setSorting] = useState(false)
  const [allWindows, setAllWindows] = useState([])
  const [currentWindow, setCurrentWindow] = useState({})
  const [moveModalVisible, setMoveModalVisible] = useState(false)
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  // async function getWindows() {
  //   setAllWindows(await getAllWindows())
  //   setCurrentWindow(await getCurrentWindow())
  // }
  // useEffect(() => {
  //   getWindows()
  // }, [])

  let iconPinned = props.allPinned && (
    <ThumbtackIcon style={{ height: 16, fill: "white" }} />
  )
  let iconSound = <VolumeSlashIcon style={{ height: 16 }} />

  chrome.windows.getCurrent({ populate: true }).then((window) => {
    setCurrentWindow(window);
  })
  const sortMenu = (
    <Menu
      items={[
        {
          label: (
            <Button
              type="link"
              onClick={async () => {
                setSorting(true)
                await sortTabs("title", tabs)
                setSorting(false)
              }}>
              by Title
            </Button>
          ),
          key: "0"
        },
        {
          label: (
            <Button
              type="link"
              onClick={async () => {
                setSorting(true)
                await sortTabs("url", tabs)
                setSorting(false)
              }}>
              by URL
            </Button>
          ),
          key: "1"
        }
      ]}
    />
  )
  const pinMenu = (
    <Menu
      items={[
        {
          label: (
            <Button
              type="link"
              onClick={() => {
                processTabs("togglePinSelected", selectedTabs, tabs)
              }}>
              Toggle Pin/Unpin
            </Button>
          ),
          key: "0"
        },
        {
          label: (
            <Button
              type="link"
              onClick={() => {
                processTabs("pinSelected", selectedTabs, tabs)
              }}>
              Pin
            </Button>
          ),
          key: "1"
        },
        {
          label: (
            <Button
              type="link"
              onClick={() => {
                processTabs("unpinSelected", selectedTabs, tabs)
              }}>
              Unpin
            </Button>
          ),
          key: "2"
        }
      ]}
    />
  )
  const muteMenu = (
    <Menu
      items={[
        {
          label: (
            <Button
              type="link"
              onClick={() => {
                processTabs("toggleMuteSelected", selectedTabs, tabs)
              }}>
              Toggle Mute/Unmute
            </Button>
          ),
          key: "0"
        },
        {
          label: (
            <Button
              type="link"
              onClick={() => {
                processTabs("muteSelected", selectedTabs, tabs)
              }}>
              Mute
            </Button>
          ),
          key: "1"
        },
        {
          label: (
            <Button
              type="link"
              onClick={() => {
                processTabs("unmuteSelected", selectedTabs, tabs)
              }}>
              Unmute
            </Button>
          ),
          key: "2"
        }
      ]}
    />
  )
  let sortingIcon = sorting ? (
    <LoadingOutlined />
  ) : (
    <SortIcon className="!fill-slate-700" style={{ height: 12, width: 14 }} />
  )
  useTraceUpdate(props);
  return (
      <header
        className="bg-gradient-to-t from-cyan-500 to-blue-500 p-2 transition-all duration-200 ease-in-out"
        key={"header"}>
        <div className="flex">
          {Brand(logo)}
          {props.children}
        </div>
        <section
          className="flex flex-row justify-between items-center mt-1"
          id="selection-action">
          <ul className="flex mb-0">
            <li className="mr-3">
              <div className="flex shadow-md">
                <span
                  className="bg-zinc-200 py-[4px] px-2 rounded-l-[2px] text-black select-none"
                  title="Un/Select only filtered or visible tabs">
                  <Checkbox
                    onChange={() => {
                      console.log(selectedTabs.length, filteredTabs.length)
                      if (selectedTabs.length < filteredTabs.length)
                        dispatch(selectAllTabs())
                      if (selectedTabs.length === filteredTabs.length) {
                        console.log("clearing selected tabs")
                        dispatch(clearSelectedTabs())
                      }
                    }}
                    indeterminate={
                      selectedTabs.length > 0 &&
                      selectedTabs.length < filteredTabs.length
                    }
                    checked={selectedTabs.length === filteredTabs.length}
                  />
                </span>
                <Button
                  className="!px-2 !border-0 !rounded-l-none !bg-gradient-to-b !from-white !to-slate-200  transition"
                  title="Invert Selection"
                  onClick={() => dispatch(invertSelectedTabs())}>
                  Invert
                </Button>
              </div>
            </li>
            <li>
              <Dropdown overlay={sortMenu} className="mr-3">
                <button
                  onClick={(e) => e.preventDefault()}
                  className="ant-btn !border-0 !shadow-md !hover:shadow-sm !bg-gradient-to-b !from-white !to-slate-200">
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
                    className="ant-btn !px-2 !border-0 !bg-gradient-to-b !from-white !to-slate-200  !hover:text-black !transition mr-2 ant-btn-sm">
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
                    setSaveModalVisible(true)
                  }}>
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
                    setMoveModalVisible(true)
                  }}
                  className="ant-btn !px-2 !border-0 !bg-gradient-to-b !from-white !to-slate-200  !hover:text-black !transition mr-2  ant-btn-sm">
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
                      dispatch(clearSelectedTabs())
                    })
                  }}
                  className="ant-btn !px-2 !border-0 !bg-gradient-to-b !from-white !to-slate-200  !hover:text-black !transition mr-2 !text-red-600 ant-btn-sm">
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
                style={{ minWidth: 33 }}>
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
                  )
                  // setState({ allMuted: !props.allMuted });
                }}
                title={
                  !props.allMuted
                    ? `Mute All Visible Tabs`
                    : `Unmute All Visible Tabs`
                }>
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
    // <Profiler id={"header"} onRender={getMetrics}>
    // </Profiler>
  )
})

export default Header
