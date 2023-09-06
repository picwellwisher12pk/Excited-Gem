import { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Select, Space } from 'antd'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SyncAltIcon from 'react:/src/icons/sync-alt.svg'
import ThumbtackIcon from 'react:/src/icons/thumbtack-active.svg'
import VolumeSlashIcon from 'react:/src/icons/volume-mute.svg'

import { processTabs, getAllWindows, getCurrentWindow } from '../../general'
import { clearSelectedTabs } from '../../tabSlice.js'
import { MoveModal } from '../Modals/Move.jsx'
import { SaveModal } from '../Modals/Save.jsx'
import WindowSelector from '../WindowSelector.jsx'
import Brand from './Brand.jsx'
import MenuItemButton from './MenuItemButton.tsx'
import Selection from './Selection'
import SortButton from './SortButton'
//Images
// @ts-ignore
import logo from '/public/logo.png'
import Btn from '../Btn'





const { Option } = Select
import TimesIcon from "react:/src/icons/xmark-solid.svg"
import MoveIcon from "react:/src/icons/up-down-left-right-solid.svg"
import VolumeOffIcon from "react:/src/icons/volume-off.svg"
import VolumeIcon from "react:/src/icons/volume.svg"
import SaveIcon from "react:/src/icons/floppy-disk-solid.svg"

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

  async function getWindows() {
    setAllWindows(await getAllWindows())
    setCurrentWindow(await getCurrentWindow())
  }

  useEffect(() => {
    getWindows()
  }, [])

  const iconPinned = props.allPinned && (
    <ThumbtackIcon style={{ height: 16, fill: 'white' }} />
  )
  const iconSound = <VolumeSlashIcon style={{ height: 16 }} />

  // chrome.windows.getCurrent({ populate: true }).then((window) => {
  //   setCurrentWindow(window)
  // })

  //Event Handlers

  const handlePinning = useCallback((e) => {
    console.log('pinning', e, e.target)
  }, [])
  const handleMuting = useCallback((e) => {
    console.log('muting', e)
  }, [])

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
    label: <MenuItemButton label={option} callback={handlePinning} />
  }))
  const muteOptions: Item[] = muteActions.map((option, i) => ({
    key: i,
    label: <MenuItemButton label={option} callback={handleMuting} />
  }))
  const pinMenu = <Menu items={pinOptions} />
  const muteMenu = <Menu items={muteOptions} />
  // const muteBtnStyle = "!border-0 !shadow-md !hover:shadow-sm !bg-gradient-to-b !from-white !to-slate-200 ml-2"

  return (
    <header className="bg-gradient-to-t from-cyan-500 to-blue-500 p-2 transition-all duration-200 ease-in-out">
      <section className="flex">
        {Brand(logo)}
        {props?.children}
      </section>
      <section
        className="flex flex-row justify-between items-center mt-1"
        id="selection-action">
        <div className="flex mb-0">
          <div className="mr-3">
            <Selection />
          </div>
          <div>{sortButton}</div>
          <div>
            <WindowSelector />
          </div>
        </div>
        {selectedTabs.length > 0 && (
          <Space >
            {/* <Select defaultValue={"selected"} className="!border-0 !mr-2">
                <Option value="selected">With selected</Option>
                <Option value="filtered">With Filtered</Option>
              </Select> */}
            <span className="px-2 pl-0 text-white select-none font-semibold">
              With Selected ({selectedTabs.length})
            </span>
            <div>
              <Dropdown menu={pinMenu} trigger={['click']}>
                <Btn
                  onClick={(e) => e.preventDefault()}
                >
                  <ThumbtackIcon
                    style={{ height: 12 }}
                    className="fill-inherit"
                  />
                  <span>Un/Pin</span>
                  <DownOutlined className="text-zinc-500" />
                </Btn>
              </Dropdown>
            </div>
            <div>
              <Dropdown menu={muteMenu} trigger={['click']}>
                <Btn >
                  <VolumeIcon style={{ height: 12 }} className="fill-inherit" />
                  <span>Un/Mute</span>
                  <DownOutlined className="text-zinc-500" />
                </Btn>
              </Dropdown>
            </div>
            <div>
              <Btn
                onClick={() => {
                  setSaveModalVisible(true)
                }}>
                <SaveIcon
                  style={{ height: 12, width: 14 }}
                  className="inline"
                />
                <span> Save ...</span>
              </Btn>
            </div>

            <div>
              <Btn
                title="Move Selected Tabs"
                onClick={() => {
                  setMoveModalVisible(true)
                }}
              >
                <MoveIcon style={{ height: 14 }} />
                <Space>
                  <span>Move ...</span>
                </Space>
              </Btn>
            </div>
            <div>
              <Btn
                title="Close Selected"
                onClick={() => {
                  processTabs('closeSelected', selectedTabs, tabs, () => {
                    dispatch(clearSelectedTabs())
                  })
                }}
              >
                <TimesIcon style={{ height: 14, width: 14, fill: "red" }} />
                <span> Close</span>
              </Btn>
            </div>
            <div className={'input-group-append'}>
              {/* <button
                className="btn btn-default"
                onClick={() => props.processSelectedTabs("toNewWindow")}
              >
                <FA icon={faShareSquare} />
              </button> */}
            </div>
          </Space>
        )}
        <Space className="mr-1">
          <Btn
            title="Refresh View"
            onClick={() => {
              // updateTabs();
              // this.setState({ tabs: props.tabs });
            }}
            style={{ minWidth: 33 }}>
            <SyncAltIcon style={{ height: 14 }} />
          </Btn>

          <div>
            <Btn
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
            </Btn>
          </div>
        </Space>
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

export default memo(Header)
