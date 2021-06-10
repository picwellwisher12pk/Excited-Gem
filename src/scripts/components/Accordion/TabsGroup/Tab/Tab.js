import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useSelector, useDispatch } from "react-redux";
import { updateSelectedTabs } from "../../../../tabSlice";
import { ItemTypes } from "./ItemTypes";

//Icons
import VolumeOffIcon from "volume-off.svg";
import VolumeIcon from "volume.svg";
import VolumeSlashIcon from "volume-slash.svg";
import TimesIcon from "times.svg";
import ThumbtackIcon from "thumbtack.svg";
//Polyfill
let browser = require("webextension-polyfill");

const Tab = (props) => {
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const dispatch = useDispatch();
  let { title, url, selected, pinned, discarded } = props;
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
  let loading = props.status === "loading",
    audible = props.audible || props.muted,
    actionButtons,
    audioIcon;
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
  if (searchTerm) {
    let regex;
    try {
      regex = new RegExp(searchTerm, "gi");
    } catch (e) {
      console.error("Bad Regular Expressions:", e, searchTerm);
    }
    title = props.title.replace(regex, "<mark>$&</mark>");
    url = props.url.replace(regex, "<mark>$&</mark>");
  }

  //Audio Icons rendering
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

  //Pin Icon Rendering
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
        className={`clickable pin-tab ${pinned ? ' active' : ' disabled'}`}
        onClick={() => props.togglePinTab(props.id)}
        aria-label="pinned"
      >
        {iconPinned}
      </li>,
      <li
        key={2}
        title="Un/Mute Tab"
        className={`clickable sound-tab` + (audible ? ` active` : ` disabled`)}
        onClick={() => props.toggleMuteTab(props.id, audible)}
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
        (selected ? " checked" : " ") +
        (loading ? " loading" : discarded ? " idle" : "")
      }
      data-discarded={discarded}
      style={{ opacity }}
      data-handler-id={handlerId}
      draggable={true}
    >
      <label className="tab-favicon" aria-label="favicon">
        {!selected && (
          <img
            src={props.favIconUrl}
            title={props.favIconUrl && title}
            alt={props.favIconUrl && title}
          />
        )}

        <input
          type="checkbox"
          onChange={() =>
            dispatch(
              updateSelectedTabs({ id: props.id, selected: !props.selected })
            )
          }
          checked={selected}
          selected={selected}
          className="checkbox"
        />
      </label>
      <a
        className={`clickable tab-title clip font-weight-bold`}
        style={{ opacity: discarded || loading ? 0.5 : 1 }}
        title={props.url}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <span
        className="tab-url trimmed clip dimmed"
        dangerouslySetInnerHTML={{ __html: url }}
        onClick={() => browser.tabs.update(props.id, { active: true })}
      />
      <ul className=" tab-actions" role="group" aria-label="options">
        {actionButtons}
      </ul>
    </li>
  );
};

// const mapStateToProps = function (state) {
//   return {
//     searchTerm: state.search.searchTerm,
//   };
// };
// const mapDispatchToProps = (dispatch) => ({
//   closeTab: (id) => dispatch(ACTIONS.closeTabs(id)),
//   togglePinTab: (id) => dispatch(ACTIONS.togglePinTab(id)),
//   toggleMuteTab: (id) => dispatch(ACTIONS.toggleMuteTab(id)),
//   searchInTabs: (searchTerm) => dispatch(ACTIONS.searchInTabs(searchTerm)),
//   updateSelectedTabs: (id, selected) =>
//     dispatch(updateSelectedTabs(id, selected)),
//   toggleSearchInAction: (searchInArray) =>
//     dispatch(ACTIONS.toggleSearchInAction(searchInArray)),
// });
export default Tab;
