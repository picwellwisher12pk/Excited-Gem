import { List } from 'antd'
import React from 'react'
import parse from 'html-react-parser'
import { useDispatch, useSelector } from 'react-redux'
import { Pin, Volume2, VolumeX, X } from 'lucide-react'
import { updateSelectedTabs } from '../../store/tabSlice'
import ItemBtn from '../ItemBtn'
import { TabIcon } from './TabIcon'
import { markSearchedTerm, renderAudioIcon } from './helpers'
import { TabContextMenu } from './ContextMenu'
import { faviconCache } from '~/utils/faviconCache'

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
  tabActionButtons?: 'always' | 'hover';
  groupColor?: string;
  isGrouped?: boolean;
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
  tabActionButtons = 'hover',
  groupColor,
  isGrouped
}: Readonly<TabProps>) {
  // console.log('📌 Tab component rendering:', id, title);

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

  const cachedFavicon = React.useMemo(() => {
    return faviconCache.getOrSet(url, favIconUrl);
  }, [url, favIconUrl]);

  const isLoading = status === 'loading'
  const discardedClass = discarded ? ' idle' : ''

  return (
    <List.Item
      ref={ref}
      key={id}
      id={String(id)}
      className={`
        w-full overflow-hidden tab-item flex items-center pr-2 pl-2 py-2
        hover:bg-slate-200 transition-colors duration-300
        border-b border-stone-100 !justify-start group
        ${selected ? ' checked bg-slate-100' : ''}
        ${isLoading ? ' loading' : discardedClass}
        ${isGrouped ? 'ml-4 border-l-4 bg-slate-50/50' : ''}
      `}
      style={isGrouped && groupColor ? { borderLeftColor: groupColor } : undefined}
      data-discarded={discarded}
    >
      <TabContextMenu tab={{ id, title, url, pinned, mutedInfo, discarded }}>
        <div className="flex w-full items-center">
          <TabIcon
            onChange={handleSelectedTabsUpdate}
            checked={selected}
            loading={isLoading}
            discarded={discarded}
            src={cachedFavicon}
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
            className={`tab-actions flex align-self-center justify-self-end ms-3 gap-2 shrink-0 transition-opacity duration-200 ${tabActionButtons === 'hover' ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              } ${audible || mutedInfo.muted ? '!opacity-100' : ''}`}
            role="group"
            aria-label={`Actions for tab: ${title}`}>
            {(audible || mutedInfo.muted) && (
              <ItemBtn
                title={mutedInfo.muted ? "Unmute Tab" : "Mute Tab"}
                aria-label={`${mutedInfo.muted ? 'Unmute' : 'Mute'} tab: ${title}`}
                onClick={handleMuteTab}
                className="rounded-full !bg-slate-200 hover:!bg-slate-300 !border-0 !shadow-none w-7 h-7 flex items-center justify-center"
              >
                {mutedInfo.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </ItemBtn>
            )}
            {activeTab && (
              <>
                <ItemBtn
                  title={pinned ? "Unpin Tab" : "Pin Tab"}
                  aria-label={`${pinned ? 'Unpin' : 'Pin'} tab: ${title}`}
                  onClick={handlePinTab}
                  className="rounded-full !bg-slate-200 hover:!bg-slate-300 !border-0 !shadow-none w-7 h-7 flex items-center justify-center"
                >
                  <Pin size={14} className={pinned ? "fill-current" : ""} />
                </ItemBtn>
                <ItemBtn
                  title="Close Tab"
                  aria-label={`Close tab: ${title}`}
                  onClick={handleRemove}
                  className="rounded-full !bg-slate-200 hover:!bg-slate-300 !border-0 !shadow-none group w-7 h-7 flex items-center justify-center"
                >
                  <X size={14} className="text-red-500 group-hover:text-red-600" />
                </ItemBtn>
              </>
            )}
          </div>
        </div>
      </TabContextMenu>
    </List.Item>
  )
}
