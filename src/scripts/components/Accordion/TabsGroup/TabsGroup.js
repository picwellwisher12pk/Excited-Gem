import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Tab from './Tab/index';
import {log} from '../../general';
var browser = require("webextension-polyfill");

export default class TabsGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabs: []
    };
    this.render = this.render.bind(this);
  }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // console.log("Tabsgroup.js getDerivedStateFromProps:",nextProps, prevState);
  //   // return nextProps;
  // }
  componentDidMount() {
    console.log("tabsgroup mounted:",this.state.tabs);
  }

  render() {
    // console.log("tabgroup this props children",this.state.tabs,this.props.children);
    const animated = `<TransitionGroup component="ul" className="tab tabs-list sortable selectable">
              ${this.props.children}
            </TransitionGroup>`;
    // const { innerRef } = this.props;
    // const staticList = `<ul className="tab tabs-list sortable selectable" ref=${provided.innerRef}> ${this.props.children}</ul>`;
    return (
      <Droppable droppableId="droppable" id={'droppable'}>
        {(provided, snapshot) => (
          <ul className="tab tabs-list sortable selectable" ref={provided.innerRef} id={'droppableUL'}>
          {this.props.children}
          {provided.placeholder}
          </ul>
          )}
      </Droppable>
      );
  }
}
TabsGroup.propTypes = {
  preferences: PropTypes.object,
  tabs: PropTypes.array,
};