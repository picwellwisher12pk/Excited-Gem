import DownOutlined from '@ant-design/icons'
import { Dropdown, Select, Space } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { ReactNode } from 'react'

// Import SVG icons
import SyncAltIcon from 'react:/src/icons/sync-alt.svg'
import ThumbtackIcon from 'react:/src/icons/thumbtack-active.svg'
import VolumeSlashIcon from 'react:/src/icons/volume-mute.svg'
import TimesIcon from "react:/src/icons/xmark-solid.svg"
import MoveIcon from "react:/src/icons/up-down-left-right-solid.svg"
import VolumeIcon from "react:/src/icons/volume.svg"
import SaveIcon from "react:/src/icons/floppy-disk-solid.svg"
import MoonIcon from "react:/src/icons/light/moon.svg"
import logo from '~/assets/logo.svg'

import { getAllWindows, getCurrentWindow, processTabs } from '~/scripts/general'
import { clearSelectedTabs } from '~/store/tabSlice'
import { MoveModal } from '~/components/Modals/Move'
import { SaveModal } from '~/components/Modals/Save'
import WindowSelector from '~/components/WindowSelector'
import Brand from './Brand'
import MenuItemButton from './MenuItemButton'
import Selection from './Selection'
import SortButton from './SortButton'
import Btn from '~/components/Btn'
import { SidebarToggleButton } from '~/components/Sidebar'

const { Option } = Select

interface HeaderProps {
  children?: ReactNode
  allSelected?: boolean
  allMuted?: boolean
  allPinned?: boolean
  processSelectedTabs?: (action: string) => void
  sidebarToggle?: () => void
}

interface TabState {
  selectedTabs: string[]
  tabs: any[]
  filteredTabs: any[]
}

interface MenuItem {
  key: number
  label: ReactNode
}

const pinActions: string[] = ['toggle', 'pin', 'unpin']
const muteActions: string[] = ['toggle', 'mute', 'unmute']

export default function Header({
  children,
  allSelected = false,
  allMuted = false,
  allPinned = false,
  processSelectedTabs = () => { },
  sidebarToggle
}: Readonly<HeaderProps>) {
  const dispatch = useDispatch()
  const { selectedTabs, tabs, filteredTabs } = useSelector((state: { tabs: TabState }) => state.tabs)
  const [checkedList, setCheckedList] = useState(selectedTabs)
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)

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

  const iconPinned = allPinned && (
    <ThumbtackIcon style={{ height: 16, fill: 'white' }} />
  )
  const iconSound = <VolumeSlashIcon style={{ height: 16 }} />

  // Handlers for pin and mute actions using Select components
  const handlePin = useCallback(
    (value: string) => {
      processTabs(value, selectedTabs, tabs)
    },
    [selectedTabs, tabs]
  )

  const handleMute = useCallback(
    (value: string) => {
      processTabs(value, selectedTabs, tabs)
    },
    [selectedTabs, tabs]
  )

  const sortButton = useMemo(() => <SortButton tabs={tabs} />, [tabs])

  // Replace Dropdown menus with Select components for pin and mute actions
  const pinMenu = {
    items: pinActions.map((action) => ({
      key: action,
      label: action,
    })),
    onClick: ({ key }) => handlePin(key),
  }

  const pinSelect = (
    <Dropdown menu={pinMenu} trigger={['click']}>
      <Btn className="mr-2">
        <span>Pin</span>
        <DownOutlined className="ml-2 text-zinc-500" />
      </Btn>
    </Dropdown>
  )

  const muteMenu = {
    items: muteActions.map((action) => ({
      key: action,
      label: action,
    })),
    onClick: ({ key }) => handleMute(key),
  }

  const muteSelect = (
    <Dropdown menu={muteMenu} trigger={['click']}>
      <Btn className="mr-2">
        <span>Mute</span>
        <DownOutlined className="ml-2 text-zinc-500" />
      </Btn>
    </Dropdown>
  )

  return (
    <header className="bg-gradient-to-t from-cyan-500 to-blue-500 p-2 transition-all duration-200 ease-in-out">
      <section className="flex">
        {sidebarToggle && (
          <div className="mr-2">
            <SidebarToggleButton onClick={sidebarToggle} />
          </div>
        )}
        {Brand(logo)}
        {children}
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
          <Space>
            <span className="px-2 pl-0 text-white select-none font-semibold">
              Actions for selection ({selectedTabs.length} tabs)
            </span>
            <div>
              {pinSelect}
            </div>
            <div>
              {muteSelect}
            </div>
            <div>
              <Btn onClick={() => setSaveModalVisible(true)}>
                <SaveIcon style={{ height: 12, width: 14 }} className="inline" />
                <span> Save ...</span>
              </Btn>
            </div>
            <div>
              <Btn
                title="Move Selected Tabs"
                onClick={() => setMoveModalVisible(true)}
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
            <div>
              <Btn
                title="Discard Selected"
                onClick={() => {
                  processTabs('discardSelected', selectedTabs, tabs)
                }}
              >
                <MoonIcon style={{ height: 14, width: 14 }} />
                <span> Discard</span>
              </Btn>
            </div>
          </Space>
        )}
        <Space className="mr-1">
          <Btn
            title="Refresh View"
            onClick={() => { }}
            style={{ minWidth: 33 }}>
            <SyncAltIcon style={{ height: 14 }} />
          </Btn>
          <div>
            <Btn
              onClick={() => {
                processSelectedTabs(!allMuted ? 'muteSelected' : 'unmuteSelected')
              }}
              title={!allMuted ? 'Mute All Visible Tabs' : 'Unmute All Visible Tabs'}>
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
  )
}
