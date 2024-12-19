import {List} from 'antd'
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react'
import ContentLoader from 'react-content-loader'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {useDispatch, useSelector} from 'react-redux'

import Tab from './components/Tab'
import {asyncFilterTabs} from './general.js'
import {updateFilteredTabs} from '../store/tabSlice'

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

const TabWindowWrapper = React.memo(() => {
  const dispatch = useDispatch()
  const [width, setWidth] = useState(0)
  const [loading, setLoading] = useState(true)
  const {tabs, filteredTabs} = useSelector((state) => state.tabs)
  const {ignoreCase, regex} = useSelector((state) => state.search)
  const searchObject = useSelector((state) => state.search)
  const searchPref = {ignoreCase, regex}
  const selectedTabs = useSelector((state) => state.tabs.selectedTabs)
  // const [filteredTabs, setFilteredTabs] = useState(tabs);

  const findFilteredTabs = async (
    searchObject,
    searchPref,
    tabs,
    setLoading
  ) => {
    if (!searchObject.searchTerm) {
      setLoading(false)
      dispatch
      return
    }
    dispatch(
      updateFilteredTabs(
        tabs && (await asyncFilterTabs(searchObject, searchPref, tabs))
      )
    )
    setLoading(false)
  }
  useLayoutEffect(() => {
    setWidth(document.body.offsetWidth)
  })
  useEffect(() => {
    if (
      searchObject.searchTerm === '' &&
      !searchObject.audibleSearch &&
      !searchObject.pinnedSearch
    ) {
      dispatch(updateFilteredTabs(tabs))
    } else {
      setLoading(true)
      findFilteredTabs(searchObject, searchPref, tabs, setLoading)
    }
  }, [searchObject, tabs])

  useEffect(() => {
    setLoading(false)
  }, [])

  const moveTab = (itemId, dragIndex, index) => {
    chrome.tabs.move(itemId, {index})
  }
  const remove = (itemId) => {
    chrome.tabs.remove(itemId)
  }
  const toggleMuteTab = (itemId, status) => {
    chrome.tabs.update(itemId, {muted: !status})
  }
  const togglePinTab = (itemId, status) => {
    chrome.tabs.update(itemId, {pinned: !status})
  }

  return !loading ? (
    <div className="tabs-list-container">
      <React.Suspense fallback={<h1>Loading profile...</h1>}>
        <DndProvider backend={HTML5Backend}>
          <List id={'droppableUL'}>
            {filteredTabs?.map((tab) => (
              <Tab
                {...tab}
                key={tab?.id}
                activeTab={true}
                index={tab?.index}
                moveTab={moveTab}
                //If current tab.id exists in selectedTabs array
                selected={selectedTabs.indexOf(tab?.id) >= 0 ? true : false}
                remove={remove}
                togglePinTab={togglePinTab}
                toggleMuteTab={toggleMuteTab}
              />
            ))}
          </List>
        </DndProvider>
      </React.Suspense>
    </div>
  ) : (
    <MyLoader width={width}/>
  )
})

export default TabWindowWrapper
