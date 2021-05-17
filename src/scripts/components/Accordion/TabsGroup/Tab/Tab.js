import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import VolumeOffIcon from "volume-off.svg";
import VolumeIcon from "volume.svg";
import VolumeSlashIcon from "volume-slash.svg";
import TimesIcon from "times.svg";
import ThumbtackIcon from "thumbtack.svg";

import { connect } from "react-redux";
import ACTIONS from "../../../../action";
import { ItemTypes } from "./ItemTypes";

let browser = require("webextension-polyfill");
const Tab = (props) => {
  let { title, url, checked, pinned, discarded } = props;
  const ref = useRef(null);
  /**
   * Specifies which props to inject into your component.
   */

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.Tab,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      console.log("hover", item);
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
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
  // console.log('props of tabs',props);
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.Tab, id: props.id, index: props.index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  //Search Highlighting;
  if (props.searchTerm) {
    const { searchTerm } = props;
    let regex;
    try {
      regex = new RegExp(searchTerm, "gi");
    } catch (e) {
      console.error("Bad Regular Expressions:", e, searchTerm);
    }
    title = props.title.replace(regex, "<mark>$&</mark>");
    url = props.url.replace(regex, "<mark>$&</mark>");
  }

  let loading = props.status === "loading",
    audible = props.audible || props.muted,
    actionButtons,
    audioIcon;
  if (!audible)
    audioIcon = (
      <VolumeOffIcon style={{ height: 16, fill: "gray", marginRight: 18 }} />
    );
  if (audible && !props.muted)
    audioIcon = (
      <VolumeIcon style={{ height: 16, fill: "gray", marginRight: 18 }} />
    );
  if (audible && props.mutedInfo.muted)
    audioIcon = (
      <VolumeSlashIcon style={{ height: 16, fill: "gray", marginRight: 18 }} />
    );
  let iconPinned = pinned ? (
    <ThumbtackIcon style={{ height: 16, fill: "gray", marginRight: 18 }} />
  ) : (
    <ThumbtackIcon style={{ height: 16, fill: "gray", marginRight: 18 }} />
  );

  //Markup of Action bar for active tabs: Right side buttons
  if (props.activeTab) {
    actionButtons = [
      <li
        key={1}
        title="Un/Pin Tab"
        className={`clickable pin-tab` + (pinned ? ` active` : ` disabled`)}
        onClick={() => props.togglePin(props.id)}
        aria-label="pinned"
      >
        {iconPinned}
      </li>,
      <li
        key={2}
        title="Un/Mute Tab"
        className={`clickable sound-tab` + (audible ? ` active` : ` disabled`)}
        onClick={() => props.toggleMute(props.id)}
      >
        {audioIcon}
      </li>,
      <li
        key={3}
        title="Close Tab"
        className="clickable remove-tab"
        data-id={props.id}
        onClick={() => props.closeTab(props.id)}
        data-command="remove"
      >
        <TimesIcon style={{ height: 16, fill: "red" }} />
      </li>,
    ];
  } else {
    //Non-Active Tabs only get a remove button on action bar for now.
    actionButtons = (
      <li
        title="Remove"
        className="clickable remove-tab"
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
        `tab-item` +
        (checked ? " checked" : "") +
        (loading || discarded ? ` idle` : "")
      }
      style={{ opacity }}
      data-handler-id={handlerId}
      draggable={true}
    >
      <label className="tab-favicon" aria-label="favicon">
        <img
          src={props.favIconUrl}
          title={props.favIconUrl && title}
          alt={props.favIconUrl && title}
        />
        <input
          type="checkbox"
          onChange={() => props.updateSelectedTabs(props.id, !props.checked)}
          checked={props.checked}
          className="checkbox"
        />
      </label>
      <a
        className="clickable tab-title clip"
        title={url}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <span
        className="tab-url trimmed dimmed clip"
        dangerouslySetInnerHTML={{ __html: url }}
        onClick={() => browser.tabs.update(props.id, { active: true })}
      />
      <ul className=" tab-actions" role="group" aria-label="options">
        {actionButtons}
      </ul>
    </li>
  );
};

const mapStateToProps = function (state) {
  return {
    searchTerm: state.search.searchTerm,
  };
};
const mapDispatchToProps = (dispatch) => ({
  closeTab: (id) => dispatch(ACTIONS.closeTabs(id)),
  togglePin: (id) => dispatch(ACTIONS.togglePin(id)),
  toggleMute: (id) => dispatch(ACTIONS.toggleMute(id)),
  searchInTabs: (searchTerm) => dispatch(ACTIONS.searchInTabs(searchTerm)),
  // updateSelectedTabs: (id, selected) => dispatch(ACTIONS.updateSelectedTabs(id, selected)),
  toggleSearchInAction: (searchInArray) =>
    dispatch(ACTIONS.toggleSearchInAction(searchInArray)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Tab);
