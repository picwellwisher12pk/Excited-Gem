import { LoadingOutlined } from '@ant-design/icons'
import { Button, Checkbox, Dropdown, Menu, Select, Space } from 'antd'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SyncAltIcon from 'react:/src/icons/sync-alt.svg'
import ThumbtackIcon from 'react:/src/icons/thumbtack-active.svg'
import VolumeSlashIcon from 'react:/src/icons/volume-mute.svg'

import { processTabs, sortTabs } from '../../general'
import {
  clearSelectedTabs,
  invertSelectedTabs,
  selectAllTabs
} from '../../tabSlice.js'
import { MoveModal } from '../Modals/Move.jsx'
import { SaveModal } from '../Modals/Save.jsx'
import WindowSelector from '../WindowSelector.jsx'
import Brand from './Brand.jsx'
import MenuItemButton from './MenuItemButton.tsx'
import SortButton from './SortButton'
//Images
// @ts-ignore
import logo from '/public/logo.png'

// import TimesIcon from "react:~/icons/times.svg"
// import VolumeOffIcon from "react:~/icons/volume-off.svg"
// import VolumeIcon from "react:~/icons/volume.svg"

export function getCurrentWindow() {
  return chrome.windows.getCurrent({ populate: true })
}

export function getAllWindows() {
  return chrome.windows.getAll({
    populate: true,
    windowTypes: ['normal']
  })
}

const { Option } = Select

function useTraceUpdate(props) {
  const prev = useRef(props)
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v]
      }
      return ps
    }, {})
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps)
    }
    prev.current = props
  })
}
type actionType = string
type action = string

const pinActions: string[] = ['toggle', 'pin', 'unpin']
const muteActions: string[] = ['toggle', 'mute', 'unmute']

const Header = (props) => {
  console.log('Header')
  const dispatch = useDispatch()
  const { selectedTabs, tabs, filteredTabs } = useSelector(
    (state) => state.tabs
  )
  const [checkedList, setCheckedList] = useState(selectedTabs)
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)

  const [allSelected, setAllSelected] = useState(props.allSelected)
  const [allMuted, setAllMuted] = useState(props.allMuted)

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
    <ThumbtackIcon style={{ height: 16, fill: 'white' }} />
  )
  let iconSound = <VolumeSlashIcon style={{ height: 16 }} />

  chrome.windows.getCurrent({ populate: true }).then((window) => {
    setCurrentWindow(window)
  })

  const handlePin = useCallback(
    (option, selectedTabs, tabs) => {
      processTabs(option, selectedTabs, tabs)
    },
    [selectedTabs, tabs]
  )
  const handleMute = useCallback(
    (option: string, selectedTabs, tabs) => {
      processTabs(option, selectedTabs, tabs)
    },
    [selectedTabs, tabs]
  )
  const sortButton = useMemo(() => <SortButton tabs={tabs} />, [])
  const pinOptions: Item[] = pinActions.map((option, i) => ({
    key: i,
    label: (
      <MenuItemButton
        option={option}
        callback={() => handlePin(option, selectedTabs, tabs)}
      />
    )
  }))
  const muteOptions: Item[] = pinActions.map((option, i) => ({
    key: i,
    label: (
      <MenuItemButton
        option={option}
        callback={() => handleMute(option, selectedTabs, tabs)}
      />
    )
  }))
  const pinMenu = <Menu items={pinOptions} />
  const muteMenu = <Menu items={muteOptions} />

  useTraceUpdate(props)
  return (
    <header
      className="bg-gradient-to-t from-cyan-500 to-blue-500 p-2 transition-all duration-200 ease-in-out"
      key={'header'}>
      <div className="flex">
        {Brand(logo)}
        {props?.children}
      </div>
      <section
        className="flex flex-row justify-between items-center mt-1"
        id="selection-action">
        <ul className="flex mb-0">
          <li className="mr-3">
            <div className="flex shadow-md">
              <span
                className="bg-zinc-200 px-2 !rounded-l-md text-black select-none"
                title="Un/Select only filtered or visible tabs">
                <Checkbox
                  onChange={() => {
                    console.log(selectedTabs.length, filteredTabs.length)
                    if (selectedTabs.length < filteredTabs.length)
                      dispatch(selectAllTabs())
                    if (selectedTabs.length === filteredTabs.length) {
                      console.log('clearing selected tabs')
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
                size={'small'}
                className="!px-2 !border-0 !rounded-l-none !bg-gradient-to-b !from-white !to-slate-200  transition"
                title="Invert Selection"
                onClick={() => dispatch(invertSelectedTabs())}>
                Invert
              </Button>
            </div>
          </li>
          <li>{sortButton}</li>
          <li>
            {allWindows.length > 1 && (
              <WindowSelector
                key={'windowSelector'}
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
                <Button
                  size={'small'}
                  // onClick={(e) => e.preventDefault()}
                  className=" !px-2 !border-0 !bg-gradient-to-b !from-white !to-slate-200  !hover:text-black !transition mr-2">
                  {/* <ThumbtackIcon
                    style={{ height: 12 }}
                    className="fill-inherit"
                  /> */}
                  Un/Pin <small style={{ fontSize: 8 }}>▼</small>
                </Button>
              </Dropdown>
            </div>
            <div>
              <Dropdown overlay={muteMenu} arrow={true}>
                <Button
                  size={'small'}
                  className="!px-2 !border-0 mr-2 !bg-gradient-to-b !from-white !to-slate-200 !hover:to-white  !hover:text-black !transition">
                  {/* <VolumeIcon style={{ height: 12 }} className="fill-inherit" /> */}
                  Un/Mute <small style={{ fontSize: 8 }}>▼</small>
                </Button>
              </Dropdown>
            </div>
            <div>
              <Button
                size={'small'}
                className="!px-2 !border-0 mr-2 !bg-gradient-to-b !from-white !to-slate-200 !hover:to-white  !hover:text-black !transition "
                onClick={() => {
                  setSaveModalVisible(true)
                }}>
                {/* <SaveIcon
                  style={{ height: 12, width: 14 }}
                  className="inline"
                /> */}
                <span> Save ...</span>
              </Button>
            </div>

            <div>
              <Button
                size={'small'}
                title="Move Selected Tabs"
                onClick={() => {
                  setMoveModalVisible(true)
                }}
                className="!px-2 !border-0 !bg-gradient-to-b !from-white !to-slate-200  !hover:text-black !transition mr-2 ">
                {/* <TimesIcon style={{ height: 14, width: 14, fill: "red" }} /> */}
                <Space>
                  <span>Move ...</span>
                </Space>
              </Button>
            </div>
            <div>
              <Button
                size={'small'}
                title="Close Selected"
                onClick={() => {
                  processTabs('closeSelected', selectedTabs, tabs, () => {
                    dispatch(clearSelectedTabs())
                  })
                }}
                className="!px-2 !border-0 !bg-gradient-to-b !from-white !to-slate-200  !hover:text-black !transition mr-2 !text-red-600 ">
                {/* <TimesIcon style={{ height: 14, width: 14, fill: "red" }} /> */}
                <span> Close</span>
              </Button>
            </div>
            <div className={'input-group-append'}>
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
            <Button
              size={'small'}
              className="!border-0 !shadow-md !hover:shadow-sm !bg-gradient-to-b !from-white !to-slate-200 flex justify-center items-center"
              title="Refresh View"
              onClick={() => {
                // updateTabs();
                // this.setState({ tabs: props.tabs });
              }}
              style={{ minWidth: 33 }}>
              <SyncAltIcon style={{ height: 14 }} />
            </Button>
          </li>

          <li>
            <Button
              size={'small'}
              className="!border-0 !shadow-md !hover:shadow-sm !bg-gradient-to-b !from-white !to-slate-200 ml-2"
              onClick={() => {
                props.processSelectedTabs(
                  !props.allMuted ? 'muteSelected' : 'unmuteSelected'
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
            </Button>
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
}

export default Header
