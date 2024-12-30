import {useMemo} from 'react'
import {CustomScroll} from 'react-custom-scroll'
import {useSelector} from 'react-redux'

// import { profilerCallback } from "/src/scripts/general"
import store from '~/store/store'
import {updateActiveTabs} from '~/store/tabSlice'
import {getTabs} from "~/scripts/browserActions"

import '~/assets/logo.svg'
import '~/assets/dev-logo.svg'

import TabWindowWrapper from './TabWindowWrapper'
import Header from '~/components/Header/Header'
import Navigation from '~/components/Header/Navigation'
import Search from '~/components/Search'

export function updateTabs(getTabs, store) {
  getTabs(store.getState().tabs.selectedWindow).then((tabs) => {
    console.log(
      'inside updatetabs function:',
      tabs,
      store.getState().tabs.selectedWindow
    )
    store.dispatch(
      updateActiveTabs(
        tabs.map((tab) => {
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
          if (url)
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
        })
      )
    )
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
  const {tabs} = useSelector((state) => state.tabs)
  const navigation = useMemo(
    () => <Navigation tabCount={tabs.length}/>,
    [tabs]
  )
  return (
    <div className="flex flex-col h-[100vh]">
      <Header>
        <Navigation tabCount={tabs.length}/>
        <Search/>
      </Header>
      <CustomScroll
        heightRelativeToParent="100%"
        keepAtBottom={true}
        key="scroll"
        class="flex-grow">
        <TabWindowWrapper/>
      </CustomScroll>
    </div>
  )
}
export default ActiveTabs
