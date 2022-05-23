import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedTabs } from "../../../../tabSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
// import Grip from "~/icons/grip-lines-vertical.svg";
//Icons
import Loading from "~/icons/spinner-third.svg?component";
import VolumeOffIcon from "~/icons/volume-off.svg?component";
import VolumeIcon from "~/icons/volume.svg?component";
import VolumeMuteIcon from "~/icons/volume-mute.svg?component";
import TimesIcon from "~/icons/times.svg?component";
import ThumbtackIcon from "~/icons/thumbtack.svg?component";
import ThumbtackActiveIcon from "~/icons/thumbtack-active.svg?component";
//Polyfill
import browser from "webextension-polyfill";

const grayIcon = { height: 16, fill: "gray" };
const blueIcon = { height: 16, fill: "#0487cf" };
const Tab = (props) => {
  const { searchTerm, searchIn } = useSelector((state) => state.search);
  const dispatch = useDispatch();
  let { title, url, selected, pinned, discarded } = props;
  const ref = useRef(null);
  /**
   * Specifies which props to inject into your component.
   */

  const [{ handlerId }, drop] = useDrop({
    accept: "tab",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
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
  let loading = props.status === "loading",
    audible = props.audible || props.muted,
    actionButtons,
    audioIcon;
  const [{ isDragging }, drag] = useDrag({
    type: "tab",
    item: { id: props.id, index: props.index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  //Search Highlighting;
  if (searchTerm) {
    let regex;
    try {
      regex = new RegExp(searchTerm, "gi");
    } catch (e) {
      console.error("Bad Regular Expressions:", e, searchTerm);
    }
    searchIn.title && (title = props.title.replace(regex, "<mark>$&</mark>"));
    searchIn.url && (url = props.url.replace(regex, "<mark>$&</mark>"));
  }

  //Audio Icons rendering
  if (!audible) audioIcon = <VolumeOffIcon style={grayIcon} />;
  if (audible && !props.muted) audioIcon = <VolumeIcon style={blueIcon} />;
  if (audible && props.mutedInfo.muted)
    audioIcon = <VolumeMuteIcon style={grayIcon} />;

  //Pin Icon Rendering
  let iconPinned = pinned ? (
    <ThumbtackActiveIcon style={blueIcon} />
  ) : (
    <ThumbtackIcon style={grayIcon} />
  );

  //Markup of Action bar for active tabs: Right side buttons
  if (props.activeTab) {
    actionButtons = [
      <li
        key={1}
        title="Un/Pin Tab"
        className={`clickable flex pin-tab ${pinned ? " active" : " disabled"}`}
        onClick={() => props.togglePinTab(props.id)}
        aria-label="pinned"
      >
        <button className="px-2">{iconPinned}</button>
      </li>,
      <li
        key={2}
        title="Un/Mute Tab"
        className={`clickable sound-tab` + (audible ? ` active` : ` disabled`)}
        onClick={() => props.toggleMuteTab(props.id, audible)}
      >
        <button
          className="px-2"
          // style={{ minWidth: 33 }}
        >
          {audioIcon}
        </button>
      </li>,
      <li
        key={3}
        title="Close Tab"
        className="cursor-pointer px-2 remove-tab"
        data-id={props.id}
        onClick={() => props.closeTab(props.id)}
        data-command="remove"
      >
        <button className="mr-1">
          <TimesIcon style={{ height: 16, fill: "red" }} />
        </button>
      </li>,
    ];
  } else {
    //Non-Active Tabs only get a remove button on action bar for now.
    actionButtons = (
      <li
        title="Remove"
        className="clickable remove-tab mr-1"
        data-id={props.id}
        onClick={() => props.removeTab(props.url)}
        data-command="remove"
      >
        <TimesIcon style={{ height: 16, fill: "red" }} />
      </li>
    );
  }

  return (
    <li
      ref={ref}
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
        className="tab-favicon align-self-center flex px-2 items-center"
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
        title={props.url}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <span
        className="cursor-pointer whitespace-nowrap tab-url flex-grow truncate  text-zinc-400 align-self-center"
        dangerouslySetInnerHTML={{ __html: url }}
        onClick={() => browser.tabs.update(props.id, { active: true })}
      />
      <ul
        className="tab-actions flex align-self-center justify-self-end"
        role="group"
        aria-label="options"
      >
        {actionButtons}
      </ul>
    </li>
  );
};

export default React.memo(Tab);
