import { useMemo, useState } from 'react'
import { CustomScroll } from 'react-custom-scroll'
import { useSelector } from 'react-redux'

// import { profilerCallback } from "/src/scripts/general"
import store from '~/store/store'
import { updateActiveTabs, updateFilteredTabs } from '~/store/tabSlice'
import { getTabs } from "~/scripts/browserActions"

import '~/assets/logo.svg'
import '~/assets/dev-logo.svg'

import TabWindowWrapper from './TabWindowWrapper'
import Header from '~/components/Header/Header'
import Navigation from '~/components/Header/Navigation'
import Search from '~/components/Search'
import Sidebar from '~/components/Sidebar'

export function updateTabs(getTabs, store) {
  getTabs(store.getState().tabs.selectedWindow).then((tabs) => {
    console.log(
      'inside updatetabs function:',
      tabs,
      store.getState().tabs.selectedWindow
    )
    const processed = tabs.map((tab) => {
      const {
        audible,
        discarded,
        favIconUrl,
        id,
        index,
        mutedInfo,
        pinned,
        status,
        title,
        url,
        windowId,
        groupId
      } = tab
      if (url) {
        return {
          audible,
          discarded,
          favIconUrl,
          id,
          index,
          mutedInfo,
          pinned,
          status,
          title,
          url,
          groupId,
          windowId
        }
      }
      return null
    }).filter(Boolean)
    // Update both active and filtered tabs so UI shows the list initially
    store.dispatch(updateActiveTabs(processed))
    store.dispatch(updateFilteredTabs(processed))
  })
}

chrome.tabs.onRemoved.addListener(() => updateTabs(getTabs, store))
chrome.tabs.onDetached.addListener(() => updateTabs(getTabs, store))
chrome.tabs.onCreated.addListener(() => updateTabs(getTabs, store))
chrome.tabs.onAttached.addListener(() => updateTabs(getTabs, store))
chrome.tabs.onUpdated.addListener(() => updateTabs(getTabs, store))
chrome.tabs.onMoved.addListener(() => updateTabs(getTabs, store))
updateTabs(getTabs, store)

const ActiveTabs = () => {
  console.log('ActiveTabs rendered')
  // @ts-ignore
  const { tabs } = useSelector((state) => state.tabs)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const navigation = useMemo(
    () => <Navigation tabCount={tabs.length} />,
    [tabs]
  )
  return (
    <div className="flex h-[100vh] relative overflow-hidden">
      <Sidebar
        currentPage="tabs"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex flex-col flex-1">
        <Header sidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <Navigation tabCount={tabs.length} />
          <Search />
        </Header>
        <CustomScroll
          heightRelativeToParent="100%"
          keepAtBottom={true}
          key="scroll"
          className="flex-grow">
          <TabWindowWrapper />
        </CustomScroll>
      </div>
    </div>
  )
}
export default ActiveTabs
