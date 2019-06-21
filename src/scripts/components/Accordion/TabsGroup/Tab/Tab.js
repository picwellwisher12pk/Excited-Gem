// let console.log = require('console.log')('tab');
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import {
  DragSource,
  DropTarget,
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DropTargetConnector,
  DragSourceConnector,
  DragSourceMonitor,
} from 'react-dnd';
import { XYCoord } from 'dnd-core';

import { log } from '../../../general';
let browser = require('webextension-polyfill');
const tabSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const tabTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

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
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};
export default class Tab extends Component {
  constructor(props) {
    // console.log('Tab constructor');
    super(props);
    this.isChecked = this.isChecked.bind(this);
  }
  focusTab(id) {
    browser.tabs.update(id, { active: true });
  }
  isChecked(event) {
    const value = event.target.checked;
    log('tabjs. this is checked', value);
    // this.setState({checked: value});
    this.props.updateSelectedTabs(this.props.id, value);
  }
  componentWillReceiveProps(props) {
    // console.log("Tab.js getting new props:",props);
  }
  componentWillUnmount() {
    // console.log("Tab.js unmounting:");
  }
  componentDidUpdate(props, state, snapshot) {
    // console.log("Tab.js updated",props,state);
  }
  componentWillReceiveProps(props) {}

  render() {
    const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 1;
    let { title, url, checked, pinned, discarded } = this.props;
    if (window.searchTerm) {
      let regex = new RegExp(window.searchTerm, 'gi');
      title = this.props.title.replace(regex, `<mark>${window.searchTerm}</mark>`);
      url = this.props.url.replace(regex, `<mark>${window.searchTerm}</mark>`);
      log('title url postprocess', title, url);
    }
    let loading = this.props.status == 'loading';
    let audible = this.props.audible || this.props.muted;
    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(
          <li
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            id={`draggable-` + this.props.index}
            // draggableId={this.props.id}
            style={{ opacity }}
            className={`tab-item` + (checked ? ` checked` : ` `) + (loading || discarded ? ` idle` : ` `)}
          >
            <label className="tab-favicon" aria-label="favicon">
              <img src={this.props.favIconUrl} />
              <input
                type="checkbox"
                onChange={this.isChecked.bind(this)}
                checked={this.props.checked}
                className="checkbox"
              />
            </label>
            <a
              title={url}
              className="clickable tab-name clip"
              onClick={this.focusTab.bind(null, this.props.id)}
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <span
              className="tab-url trimmed dimmed clip"
              dangerouslySetInnerHTML={{ __html: url }}
              onClick={this.focusTab.bind(null, this.props.id)}
            />
            <ul className=" tab-actions" role="group" aria-label="options">
              <li
                title="Un/Pin Tab"
                className={`clickable pin-tab` + (pinned ? ` active` : ` disabled`)}
                onClick={() => this.props.togglePin(this.props.id)}
                aria-label="pinned"
              >
                <i className="fa fa-thumbtack fw-fw" />
              </li>

              <li
                title="Un/Mute Tab"
                className={`clickable sound-tab` + (audible ? ` active` : ` disabled`)}
                onClick={() => this.props.toggleMute(this.props.id)}
              >
                <i className={`fa fw-fw ` + (!this.props.muted ? ` fa-volume-up` : ` fa-volume-mute`)} />
              </li>
              <li
                title="Close Tab"
                className="clickable remove-tab"
                data-id={this.props.id}
                onClick={() => this.props.closeTab(this.props.id)}
                data-command="remove"
              >
                <i className="fa fa-times-circle fw-fw" />
              </li>
            </ul>
          </li>
        )
      )
    );
  }
}

Tab.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  pinned: PropTypes.bool,
  index: PropTypes.number,
  favicon: PropTypes.string,
  audible: PropTypes.bool,
  status: PropTypes.string,
  checked: PropTypes.bool,
};
