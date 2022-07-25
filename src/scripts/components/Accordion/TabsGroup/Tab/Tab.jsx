import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedTabs } from "../../../../tabSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  markSearchedTerm,
  renderActionButtons,
  grayIconStyle,
  blueIconStyle,
} from "./helpers";
// import Grip from "~/icons/grip-lines-vertical.svg";
//Icons
import Loading from "~/icons/spinner-third.svg?component";
import ThumbtackIcon from "~/icons/thumbtack.svg?component";
import ThumbtackActiveIcon from "~/icons/thumbtack-active.svg?component";
import browser from "webextension-polyfill";

export const Tab = (props) => {
  const dispatch = useDispatch();
  const { searchTerm, searchIn } = useSelector((state) => state.search);
  const { title, url, selected, pinned, discarded } = props;
  const refTabLi = useRef(null);

  //React DND clause
  const [{ handlerId }, drop] = useDrop({
    accept: "tab",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!refTabLi.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = refTabLi.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      props.moveTab(item.id, dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "tab",
    item: { id: props.id, index: props.index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(refTabLi));

  const loading = props.status === "loading";
  const audible = props.audible || props.muted;
  const opacity = isDragging ? 0 : 1;

  //Pin Icon Rendering
  let iconPinned = pinned ? (
    <ThumbtackActiveIcon style={blueIconStyle} />
  ) : (
    <ThumbtackIcon style={grayIconStyle} />
  );

  return (
    <li
      ref={refTabLi}
      key={props.id}
      id={props.id}
      className={
        `overflow-hidden tab-item flex py-2 bg-slate-100 hover:bg-slate-200 transition-colors duration-300 border-b-stone-100 border` +
        (selected ? " checked" : " ") +
        (loading ? " loading" : discarded ? " idle" : "")
      }
      style={{ opacity }}
      data-discarded={discarded}
      data-handler-id={handlerId}
      data-muted={props.mutedInfo.muted}
      data-audible={props.audible}
      data-pinned={props.pinned}
      draggable={true}
    >
      {/* <Grip
        // ref={drag}
        style={{
          width: 16,
          height: 16,
          marginTop: 10,
          fill: "gray",
          marginLeft: -10,
          marginRight: 10,
        }}
      />*/}
      <div
        className="tab-favicon align-self-center flex px-2 items-center min-w-[56px]"
        aria-label="favicon"
      >
        <Checkbox
          onChange={() =>
            dispatch(
              updateSelectedTabs({
                id: props.id,
                selected: !props.selected,
              })
            )
          }
          className="!mr-2"
          checked={selected}
        />
        {loading ? (
          <Loading className={"spinner"} />
        ) : (
          <LazyLoadImage
            src={props.favIconUrl}
            title={props.favIconUrl && title}
            style={{ width: 16, height: 16 }}
          />
        )}
      </div>
      <span
        className={`whitespace-nowrap clip font-bold align-self-center pr-2`}
        style={{
          opacity: discarded || loading ? 0.5 : 1,
        }}
        dangerouslySetInnerHTML={{
          __html: searchIn.title ? markSearchedTerm(title, searchTerm) : title,
        }}
        title={props.url}
      />
      <span
        className="cursor-pointer whitespace-nowrap tab-url flex-grow truncate  text-zinc-400 align-self-center"
        dangerouslySetInnerHTML={{
          __html: searchIn.url ? markSearchedTerm(url, searchTerm) : url,
        }}
        onClick={() => browser.tabs.update(props.id, { active: true })}
      />
      <ul
        className="tab-actions flex align-self-center justify-self-end"
        aria-label="options"
      >
        {renderActionButtons(props, pinned, iconPinned, audible)}
      </ul>
    </li>
  );
};
