import { List } from 'antd'
import React from 'react'
import parse from 'html-react-parser'
import { useDispatch, useSelector } from 'react-redux'
import TimesIcon from '../../icons/times.svg'
import { updateSelectedTabs } from '../../store/tabSlice'
import ItemBtn from '../ItemBtn'
import { TabIcon } from './TabIcon'
import { markSearchedTerm, renderAudioIcon } from './helpers'
import { IconPinned } from './IconPinned'

interface MutedInfo {
  muted: boolean;
  reason?: string;
}

export interface TabProps {
  id: number;
  title: string;
  url: string;
  selected: boolean;
  pinned: boolean;
  discarded: boolean;
  status: 'loading' | 'complete' | 'error';
  audible: boolean;
  muted: boolean;
  mutedInfo: MutedInfo;
  favIconUrl: string;
  activeTab: boolean;
  index: number;
  remove: (id: number) => void;
  toggleMuteTab: (id: number, muted: boolean) => void;
  togglePinTab: (id: number, pinned: boolean) => void;
}

interface SearchState {
  searchTerm: string;
  searchIn: {
    title: boolean;
    url: boolean;
  };
}

export function Tab({
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
  title = '',
  url = '',
}: Readonly<TabProps>) {
  const dispatch = useDispatch()
  const { searchTerm, searchIn } = useSelector<{ search: SearchState }, SearchState>(state => state.search)
  const ref = React.useRef<HTMLDivElement>(null)

  // Event handlers
  const handleSelectedTabsUpdate = React.useCallback(() => {
    dispatch(updateSelectedTabs({ id, selected: !selected }))
  }, [dispatch, id, selected])

  const handleTabClick = React.useCallback(() => {
    chrome.tabs.update(id, { active: true })
  }, [id])

  const handlePinTab = React.useCallback(() => {
    togglePinTab(id, pinned)
  }, [id, pinned, togglePinTab])

  const handleMuteTab = React.useCallback(() => {
    toggleMuteTab(id, mutedInfo.muted)
  }, [id, mutedInfo.muted, toggleMuteTab])

  const handleRemove = React.useCallback(() => {
    remove(id)
  }, [id, remove])

  // Memoized values
  const markedTitle = React.useMemo(() => {
    if (!title) return ' '
    return searchIn.title ? markSearchedTerm(title, searchTerm) : title
  }, [searchIn.title, title, searchTerm])

  const markedUrl = React.useMemo(() => {
    if (!url) return ' '
    return searchIn.url ? markSearchedTerm(url, searchTerm) : url
  }, [searchIn.url, url, searchTerm])

  const isLoading = status === 'loading'
  const discardedClass = discarded ? ' idle' : ''

  return (
    <List.Item
      ref={ref}
      key={id}
      id={String(id)}
      className={`
        max-w-[100vw] overflow-hidden tab-item flex pr-0
        hover:bg-slate-200 transition-colors duration-300
        border-b-stone-100 !justify-start border
        ${selected ? ' checked bg-slate-100' : ''}
        ${isLoading ? ' loading' : discardedClass}
      `}
      data-discarded={discarded}
    >
      <TabIcon
        onChange={handleSelectedTabsUpdate}
        checked={selected}
        loading={isLoading}
        discarded={discarded}
        src={favIconUrl}
        title={title}
      />
      <div className="flex flex-auto truncate">
        <span
          className="truncate font-semibold align-self-center pr-2 shrink-0"
          style={{ opacity: discarded || isLoading ? 0.7 : 1 }}
          title={url}>
          {parse(markedTitle)}
        </span>
        <button
          type="button"
          className="cursor-pointer tab-url truncate text-zinc-400 align-self-center border-0 bg-transparent text-left italic grow-0 shrink"
          onClick={handleTabClick}>
          {parse(markedUrl)}
        </button>
      </div>
      <div
        className="tab-actions flex align-self-center justify-self-end ms-3 gap-2 shrink-0"
        role="group"
        aria-label={`Actions for tab: ${title}`}>
        {activeTab && (
          <>
            <ItemBtn
              title={pinned ? "Unpin Tab" : "Pin Tab"}
              aria-label={`${pinned ? 'Unpin' : 'Pin'} tab: ${title}`}
              onClick={handlePinTab}>
              <IconPinned pinned={pinned} />
            </ItemBtn>
            <ItemBtn
              title={mutedInfo.muted ? "Unmute Tab" : "Mute Tab"}
              aria-label={`${mutedInfo.muted ? 'Unmute' : 'Mute'} tab: ${title}`}
              onClick={handleMuteTab}>
              {renderAudioIcon(audible, mutedInfo)}
            </ItemBtn>
          </>
        )}
        <ItemBtn
          onClick={handleRemove}
          title="Close Tab"
          aria-label={`Close tab: ${title}`}>
          <TimesIcon style={{ height: 14, fill: 'red' }} aria-hidden="true" />
        </ItemBtn>
      </div>
    </List.Item>
  )
}
