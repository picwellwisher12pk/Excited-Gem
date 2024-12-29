import {List} from 'antd'
import React, {useCallback, useMemo, useRef} from 'react'
import parse from 'html-react-parser'
import {useDispatch, useSelector} from 'react-redux'
// @ts-ignore
import TimesIcon from 'react:/src/icons/times.svg'
import {updateSelectedTabs} from '~/store/tabSlice'
import ItemBtn from '~/components/ItemBtn'
import {TabIcon} from './TabIcon'
import {getUseDrag, getUseDrop} from './dnd-reducers'
import {markSearchedTerm, renderAudioIcon} from './helpers'
// import Grip from "/src/icons/grip-lines-vertical.svg";
// @ts-ignore
import {IconPinned} from '~/components/Tab/IconPinned'


type TabProps = {
  id: number
  title: string
  url: string
  selected: boolean
  pinned: boolean
  discarded: boolean
  status: string
  audible: boolean
  muted: boolean
  mutedInfo: any
  favIconUrl: string
  activeTab: boolean
  remove: (id: number) => {}
  toggleMuteTab: (id: number, audible: boolean) => {}
  togglePinTab: (id: number, pinned: boolean) => {}
}

const Tab = ({
               id,
               activeTab,
               remove,
               toggleMuteTab,
               togglePinTab,
               selected,
               status,
               audible,
               mutedInfo,
               pinned,
               discarded,
               favIconUrl,
               title,
               url
             }: TabProps) => {
  const dispatch = useDispatch()
  const {searchTerm, searchIn} = useSelector(({search}) => search)
  const refTab = useRef<HTMLLIElement>(null)

  const handleSelectedTabsUpdate = useCallback(() => {
    dispatch(
      updateSelectedTabs({
        id,
        selected: !selected
      })
    )
  }, [dispatch, id, selected])

  const handleTabClick = () => {
    chrome.tabs.update(id, {active: true})
  }

  const markedTitle = useMemo(
    () => {
      if (title === undefined || title === null) return ' '
      else return searchIn.title ? markSearchedTerm(title, searchTerm) : title
    },
    [searchIn.title, title, searchTerm]
  )
  const markedUrl = useMemo(
    () => {
      if (url === undefined || url === null) return ' '
      else return searchIn.url ? markSearchedTerm(url, searchTerm) : url
    },
    [searchIn.url, url, searchTerm]
  )

  const [{handlerId}, drop] = getUseDrop(refTab, {
    id,
    selected,
    pinned,
    discarded
  })
  const [{isDragging}, drag] = getUseDrag({id, selected, pinned, discarded})
  drag(drop(refTab))

  const loading: boolean = status === 'loading'
  const opacity: number = isDragging ? 0 : 1
  const iconPinned = useMemo(() => IconPinned(pinned), [pinned])
  const handlePinTab = useCallback(() => {
      togglePinTab(id, pinned)
    },
    [id]
  )
  const handleMuteTab = () => {
    toggleMuteTab(id, mutedInfo.muted)
  }
  const handleRemove = useCallback(() => remove(id), [id])

  const discardedStatus = discarded ? ' idle' : '';

  return (
    <List.Item
      ref={refTab}
      key={id}
      id={String(id)}
      className={
        `max-w-[100vw] overflow-hidden tab-item flex py-2 hover:bg-slate-200 transition-colors duration-300 border-b-stone-100 !justify-start border${selected ? ' checked bg-slate-100' : ' '}${loading ? ' loading' : discardedStatus}`
      }
      style={{opacity}}
      data-discarded={discarded}
      data-handler-id={handlerId}
      draggable={true}>
      <TabIcon
        onChange={handleSelectedTabsUpdate}
        checked={selected}
        loading={loading}
        discarded={discarded}
        src={favIconUrl}
        title={title}
      />
      <div className="flex flex-auto truncate">
        <span
          className={`truncate font-semibold align-self-center pr-2 shrink-0`}
          style={{opacity: discarded || loading ? 0.7 : 1}}
          title={url}>
          {parse(markedTitle)}
        </span>
        <button
          className="cursor-pointer tab-url truncate text-zinc-400 align-self-center border-0 bg-transparent text-left italic grow-0 shrink"
          onClick={handleTabClick}>
          {parse(markedUrl)}
        </button>
      </div>
      <div
        className="tab-actions flex align-self-center justify-self-end mx-3 gap-2 shrink-0"
        aria-label="options">
        {activeTab && (
          <>
            <ItemBtn title="Un/Pin Tab" onClick={handlePinTab}>
              {iconPinned}
            </ItemBtn>
            <ItemBtn
              title="Un/Mute Tab"
              onClick={handleMuteTab}>
              {renderAudioIcon(audible, mutedInfo)}
            </ItemBtn>
          </>
        )}
        <ItemBtn onClick={handleRemove}>
          <TimesIcon style={{height: 14, fill: 'red'}}/>
        </ItemBtn>
      </div>
    </List.Item>
  )
}

export default Tab
