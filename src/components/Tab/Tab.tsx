import { List, Button, Tooltip } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { CloseOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import parse from 'html-react-parser'
import { controlYouTubeVideo } from '~/services/tabService';
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

export interface YouTubeInfo {
  duration: number;
  currentTime: number;
  paused: boolean;
  title: string;
  percentage: number;
  tabId: number;
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
  youtubeInfo?: YouTubeInfo; // Added youtubeInfo to TabProps
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
  isGrouped,
  youtubeInfo
}: Readonly<TabProps>) {
  // console.log('📌 Tab component rendering:', id, title);

  const dispatch = useDispatch()
  const { searchTerm, searchIn } = useSelector<{ search: SearchState }, SearchState>(state => state.search)
  const youtubePermissionGranted = useSelector((state: any) => state.tabs.youtubePermissionGranted);
  // Helper function to format time in HH:MM:SS or MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const ref = React.useRef<HTMLDivElement>(null)

  const [seekValue, setSeekValue] = useState<number>(0);
  const [isYouTube, setIsYouTube] = useState<boolean>(false);

  // Update seekValue when youtubeInfo changes
  useEffect(() => {
    if (youtubeInfo) {
      setSeekValue(youtubeInfo.percentage);
      setIsYouTube(true);
    } else if (url && url.includes("youtube.com/watch")) {
      setIsYouTube(true);
    } else {
      setIsYouTube(false);
    }
  }, [youtubeInfo, url]);

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (youtubeInfo) {
      try {
        const action = youtubeInfo.paused ? 'play' : 'pause';
        await controlYouTubeVideo(id, action);
      } catch (error) {
        console.error('Error controlling YouTube playback:', error);
      }
    }
  };

  const handleSeek = async (value: number) => {
    if (youtubeInfo) {
      try {
        setSeekValue(value);
        await controlYouTubeVideo(id, 'seek', value);
      } catch (error) {
        console.error('Error seeking YouTube video:', error);
      }
    }
  };

  const handleRequestPermission = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const granted = await chrome.permissions.request({
        origins: ["https://*.youtube.com/*", "http://*.youtube.com/*"]
      });
      if (granted) {
        // Permission granted, background script should handle injection
        console.log('YouTube permission granted');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

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
          {/* YouTube Video Controls */}
          {isYouTube && (
            <>
              {youtubeInfo ? (
                <div
                  className="flex items-center ml-2 mr-2"
                  style={{ minWidth: 180, maxWidth: 240, width: 220 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    type="text"
                    size="small"
                    onClick={handlePlayPause}
                    icon={youtubeInfo.paused ? (
                      <PlayCircleOutlined style={{ color: '#ff0000', fontSize: 16 }} />
                    ) : (
                      <PauseCircleOutlined style={{ color: '#ff0000', fontSize: 16 }} />
                    )}
                    style={{ width: 24, height: 24, padding: 0, marginRight: 4 }}
                    aria-label={youtubeInfo.paused ? 'Play' : 'Pause'}
                  />
                  <span className="text-xs text-gray-500 mr-1 min-w-[36px] text-right" style={{ width: 36 }}>
                    {formatTime(youtubeInfo.currentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={seekValue}
                    onChange={e => handleSeek(Number(e.target.value))}
                    className="youtube-seekbar"
                    style={{
                      width: '90px',
                      height: '1px',
                      background: `linear-gradient(to right, #ff0000 0%, #ff0000 ${seekValue}%, #ccc ${seekValue}%, #ccc 100%)`,
                      margin: '0 6px',
                      padding: 0,
                      WebkitAppearance: 'none',
                    }}
                  />
                  <style>{`
                    input.youtube-seekbar::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 6px;
                      height: 6px;
                      background: #ff0000;
                      border-radius: 6px;
                      cursor: pointer;
                      margin-top: -3px;
                    }
                    input.youtube-seekbar::-webkit-slider-runnable-track {
                      height: 1px;
                      background: transparent;
                    }
                  `}</style>
                  <span className="text-xs text-gray-500 ml-1 min-w-[36px] text-left" style={{ width: 36 }}>
                    {formatTime(youtubeInfo.duration)}
                  </span>
                </div>
              ) : (
                !youtubePermissionGranted && (
                  <Button
                    size="small"
                    type="text"
                    onClick={handleRequestPermission}
                    className="ml-2 text-xs text-gray-500 hover:text-red-600 flex items-center"
                    icon={<PlayCircleOutlined />}
                  >
                    Enable Controls
                  </Button>
                )
              )}
            </>
          )}

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
