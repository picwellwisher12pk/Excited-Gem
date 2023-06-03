import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { markSearchedTerm, renderActionButtons } from './helpers'
// import Grip from "/src/icons/grip-lines-vertical.svg";
// @ts-ignore
import { IconPinned } from '/src/scripts/components/Tab/IconPinned'
import { TabIcon } from '/src/scripts/components/Tab/TabIcon'
import {
  getUseDrag,
  getUseDrop
} from '/src/scripts/components/Tab/dnd-reducers'
import { updateSelectedTabs } from '/src/scripts/tabSlice'





const Tab = (props) => {
  const dispatch = useDispatch()
  // @ts-ignore
  const { searchTerm, searchIn } = useSelector((state) => state.search)
  const { title, url, selected, pinned, discarded } = props
  const refTab: React.MutableRefObject<any> = useRef(null)

  //React DND clause
  const [{ handlerId }, drop] = getUseDrop(refTab, props)
  const [{ isDragging }, drag] = getUseDrag(props)
  drag(drop(refTab))

  const loading: boolean = props.status === 'loading'
  const audible: boolean = props.audible || props.muted
  const opacity: 0 | 1 = isDragging ? 0 : 1
  let iconPinned: React.JSX.Element = IconPinned(pinned)

  return (
    <li
      ref={refTab}
      key={props.id}
      id={props.id}
      className={
        `overflow-hidden tab-item flex py-2 hover:bg-slate-200 transition-colors duration-300 border-b-stone-100 border` +
        (selected ? ' checked bg-slate-100' : ' ') +
        (loading ? ' loading' : discarded ? ' idle' : '')
      }
      style={{ opacity }}
      data-discarded={discarded}
      data-handler-id={handlerId}
      data-muted={props.mutedInfo.muted}
      data-audible={props.audible}
      data-pinned={props.pinned}
      draggable={true}>
      <TabIcon
        onChange={() =>
          dispatch(
            updateSelectedTabs({
              id: props.id,
              selected: !props.selected
            })
          )
        }
        checked={selected}
        loading={loading}
        src={props.favIconUrl}
        title={title}
      />
      <span
        className={`whitespace-nowrap clip font-bold align-self-center pr-2`}
        style={{
          opacity: discarded || loading ? 0.5 : 1
        }}
        dangerouslySetInnerHTML={{
          __html: searchIn.title ? markSearchedTerm(title, searchTerm) : title
        }}
        title={props.url}
      />
      <span
        className="cursor-pointer whitespace-nowrap tab-url flex-grow truncate  text-zinc-400 align-self-center"
        dangerouslySetInnerHTML={{
          __html: searchIn.url ? markSearchedTerm(url, searchTerm) : url
        }}
        onClick={() => chrome.tabs.update(props.id, { active: true })}
      />
      <ul
        className="tab-actions flex align-self-center justify-self-end"
        aria-label="options">
        {renderActionButtons(props, pinned, iconPinned, audible)}
      </ul>
    </li>
  )
}
export default Tab
