import { List } from 'antd'
import React, { useEffect } from 'react'
import ContentLoader from 'react-content-loader'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDispatch, useSelector } from 'react-redux'

import Tab from '~/components/Tab'
import { asyncFilterTabs } from './general'
import { updateFilteredTabs } from '~/store/tabSlice'
import { filterTabs } from '~/store/tabSlice'

const MyLoader = (props) => (
  <ContentLoader
    speed={1}
    width={props.width}
    height={500}
    viewBox={'0 0 ' + props.width + ' 500'}
    backgroundColor="#e3e3e3"
    foregroundColor="#ecebeb"
    {...props}>
    {[...Array(10)].map((_, i) => {
      const height = 20
      const radius = height / 2
      return (
        <g key={i}>
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
            width={props.width > 0 ? props.width - height - 50 : 0}
            height={height}
          />
        </g>
      )
    })}
  </ContentLoader>
)

function useTabOperations() {
  return {
    moveTab: (itemId: string, dragIndex: number, index: number) => {
      chrome.tabs.move(itemId, { index })
    },
    removeTab: (itemId: string) => {
      chrome.tabs.remove(itemId)
    },
    toggleMuteTab: (itemId: string, status: boolean) => {
      chrome.tabs.update(itemId, { muted: !status })
    },
    togglePinTab: (itemId: string, status: boolean) => {
      chrome.tabs.update(itemId, { pinned: !status })
    }
  }
}

function TabList() {
  const dispatch = useDispatch()
  const { tabs, filteredTabs, selectedTabs } = useSelector((state) => state.tabs)
  const searchState = useSelector((state) => state.search)
  const tabOperations = useTabOperations()
  const { isLoading } = useSelector((state) => state.ui)

  useEffect(() => {
    dispatch(filterTabs({ searchObject: searchState, tabs }))
  }, [searchState, tabs])

  if (isLoading) {
    return <TabListLoader />
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <List id="droppableUL" className="mr-[10px]">
        {filteredTabs?.map((tab) => (
          <Tab
            {...tab}
            key={tab.id}
            activeTab={true}
            index={tab.index}
            selected={selectedTabs.includes(tab.id)}
            {...tabOperations}
          />
        ))}
      </List>
    </DndProvider>
  )
}

export default TabList
