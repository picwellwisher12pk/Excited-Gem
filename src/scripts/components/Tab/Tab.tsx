import { TabProps } from 'types';
import { List } from 'antd';
import React, { useCallback, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactHTMLParser from 'react-html-parser'
import renderActionButtons, { markSearchedTerm } from './helpers'
// import Grip from "/src/icons/grip-lines-vertical.svg";
// @ts-ignore
import { IconPinned } from '/src/scripts/components/Tab/IconPinned'
import { TabIcon } from '/src/scripts/components/Tab/TabIcon'
import {
  getUseDrag,
  getUseDrop
} from '/src/scripts/components/Tab/dnd-reducers'
import { updateSelectedTabs } from '/src/scripts/tabSlice'


type TabProps = {
  id: number;
  title: string;
  url: string;
  selected: boolean;
  pinned: boolean;
  discarded: boolean;
  status: string;
  audible: boolean;
  muted: boolean;
  mutedInfo: any;
  favIconUrl: string;
};



const Tab = ({
  id,
  selected,
  status,
  audible,
  muted,
  mutedInfo,
  pinned,
  discarded,
  favIconUrl,
  title,
  url
}: TabProps) => {
  const dispatch = useDispatch();
  const { searchTerm, searchIn } = useSelector((state) => state.search);
  const refTab = useRef<HTMLLIElement>(null);

  const handleSelectedTabsUpdate = useCallback(() => {
    dispatch(
      updateSelectedTabs({
        id,
        selected: !selected
      })
    );
  }, [dispatch, id, selected]);

  const handleTabClick = () => {
    chrome.tabs.update(id, { active: true });
  };

  const markedTitle = useMemo(() => searchIn.title ? markSearchedTerm(title, searchTerm) : title, [searchIn.title, title, searchTerm]);
  const markedUrl = useMemo(() => searchIn.url ? markSearchedTerm(url, searchTerm) : url, [searchIn.url, url, searchTerm]);

  const [{ handlerId }, drop] = getUseDrop(refTab, { id, selected, pinned, discarded });
  const [{ isDragging }, drag] = getUseDrag({ id, selected, pinned, discarded });
  drag(drop(refTab));

  const loading = status === 'loading';
  const isAudible = audible || muted;
  const opacity: 0 | 1 = isDragging ? 0 : 1;
  const iconPinned = useMemo(() => IconPinned(pinned), [pinned]);
  return (
    <List.Item
      ref={refTab}
      key={id}
      id={id}
      className={
        `overflow-hidden tab-item flex py-2 hover:bg-slate-200 transition-colors duration-300 border-b-stone-100 border` +
        (selected ? ' checked bg-slate-100' : ' ') +
        (loading ? ' loading' : discarded ? ' idle' : '')
      }
      style={{ opacity }}
      data-discarded={discarded}
      data-handler-id={handlerId}
      data-muted={mutedInfo.muted}
      data-audible={audible}
      data-pinned={pinned}
      draggable={true}
    >
      <TabIcon
        onChange={handleSelectedTabsUpdate}
        checked={selected}
        loading={loading}
        src={favIconUrl}
        title={title}
      />
      <span
        className={`whitespace-nowrap clip font-bold align-self-center pr-2`}
        style={{ opacity: discarded || loading ? 0.5 : 1 }}
        title={url}
      >
        {ReactHTMLParser(markedTitle)}
      </span>
      <span
        className="cursor-pointer whitespace-nowrap tab-url flex-grow truncate  text-zinc-400 align-self-center"
        onClick={handleTabClick}
      >
        {ReactHTMLParser(markedUrl)}
      </span>
      <div
        className="tab-actions flex align-self-center justify-self-end mx-3"
        style={{ gap: 8 }}
        aria-label="options"
      >
        {renderActionButtons({ id, selected, activeTab: true, pinned, discarded, pinned, iconPinned, isAudible })}
      </div>
    </List.Item>
  );
};

export default Tab
