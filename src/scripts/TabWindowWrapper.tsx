import { List } from 'antd'
import React, { useEffect, useRef } from 'react'
import ContentLoader from 'react-content-loader'
import { useDispatch, useSelector } from 'react-redux'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { RootState } from '~/store/store'
import { SimpleAutoSizer } from '~/components/SimpleAutoSizer';
import { SimpleFixedSizeList } from '~/components/SimpleFixedSizeList';

import { Tab } from '~/components/Tab/Tab'
import { SortableTabs } from '~/components/Tab/SortableTabs'
import { asyncFilterTabs } from './general'
import { updateFilteredTabs } from '~/store/tabSlice'

const MyLoader = ({ width }: { width: number }) => (
  <ContentLoader
    speed={1}
    width={width}
    height={500}
    viewBox={`0 0 ${width} 500`}
    backgroundColor="#e3e3e3"
    foregroundColor="#ecebeb"
  >
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
            width={width > 0 ? width - height - 50 : 0}
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
      chrome.tabs.move(Number(itemId), { index })
    },
    remove: (itemId: number) => {
      chrome.tabs.remove(itemId)
    },
    toggleMuteTab: (itemId: number, status: boolean) => {
      chrome.tabs.update(itemId, { muted: !status })
    },
    togglePinTab: (itemId: number, status: boolean) => {
      chrome.tabs.update(itemId, { pinned: !status })
    }
  }
}

function TabList() {
  const dispatch = useDispatch()
  const { tabs, filteredTabs, selectedTabs } = useSelector((state: RootState) => state.tabs)
  const searchState = useSelector((state: RootState) => state.search)
  const tabOperations = useTabOperations()
  const [isLoading, setIsLoading] = React.useState(false)
  const listRef = useRef<any>(null)

  useEffect(() => {
    const filterAndUpdate = async () => {
      try {
        setIsLoading(true)
        console.log('🔄 Starting filter with tabs:', tabs.length)
        const filtered = await asyncFilterTabs(
          {
            searchTerm: searchState.searchTerm,
            audibleSearch: searchState.audibleSearch,
            pinnedSearch: searchState.pinnedSearch,
            searchIn: searchState.searchIn
          },
          {
            ignoreCase: true,
            regex: searchState.regex
          },
          tabs
        )
        console.log('🔍 Filtered tabs result:', filtered?.length, 'Original tabs:', tabs.length)
        dispatch(updateFilteredTabs(filtered || tabs))
      } catch (error) {
        console.error('❌ Error filtering tabs:', error)
        // Fallback to showing all tabs if filter fails
        dispatch(updateFilteredTabs(tabs))
      } finally {
        setIsLoading(false)
      }
    }

    if (tabs.length > 0) {
      filterAndUpdate()
    } else {
      setIsLoading(false)
    }
  }, [searchState, tabs, dispatch])

  console.log('📋 TabList render - filteredTabs:', filteredTabs, 'length:', filteredTabs?.length)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = filteredTabs.findIndex((tab: any) => tab.id === active.id);
      const newIndex = filteredTabs.findIndex((tab: any) => tab.id === over?.id);

      // Update local state (Redux)
      const newTabs = arrayMove(filteredTabs, oldIndex, newIndex);
      dispatch(updateFilteredTabs(newTabs));

      // Update Chrome tabs
      // We move the tab to the index of the target tab (the one we dropped over/replaced)
      const targetTab = filteredTabs[newIndex];
      if (targetTab && typeof targetTab.index === 'number') {
        chrome.tabs.move(Number(active.id), { index: targetTab.index });
      }
    }
  };

  if (isLoading) {
    return <MyLoader width={400} />
  }

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const tab = filteredTabs[index];
    if (!tab) return null;

    return (
      <div style={style}>
        <Tab
          {...tab}
          key={tab.id}
          activeTab={true}
          index={tab.index}
          selected={selectedTabs.includes(tab.id)}
          {...tabOperations}
        />
      </div>
    );
  };

  return (
    <div className="absolute inset-0 pr-[10px] overflow-hidden">
      <SimpleAutoSizer>
        {({ height, width }) => (
          <SimpleFixedSizeList
            ref={listRef}
            height={height}
            itemCount={filteredTabs?.length || 0}
            itemSize={50} // Approximate height of a tab item
            width={width}
            itemData={filteredTabs}
          >
            {Row}
          </SimpleFixedSizeList>
        )}
      </SimpleAutoSizer>
    </div>
  )
}

export default TabList
