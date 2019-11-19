import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
// import Tab from './Tab/index';
import { log } from '../../general';

export default class TabsGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabs: [],
    };
    this.render = this.render.bind(this);
  }

  componentDidMount() {
    // console.log("tabsgroup mounted:",this.state.tabs);
  }

  // return (
  //   <TransitionGroup component="ul" className="tab tabs-list sortable selectable">
  //     {this.props.children}
  //   </TransitionGroup>
  // );

  render() {
    // console.log("tabgroup this props children",this.state.tabs,this.props.children);
    // const animated = `<TransitionGroup component="ul" className="tab tabs-list sortable selectable">
    //           ${this.props.children}
    //         </TransitionGroup>`;
    // const { innerRef } = this.props;
    // const staticList = `<ul className="tab tabs-list sortable selectable" ref=${provided.innerRef}> ${this.props.children}</ul>`;
    return (
      <Droppable droppableId="droppable" id={'droppable'}>
        {provided => (
          <ul
            className="tab tabs-list sortable selectable"
            ref={provided.innerRef}
            {...provided.droppableProps}
            id={'droppableUL'}
          >
            {this.props.children}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    );
  }
}
// TabsGroup.propTypes = {
//   preferences: PropTypes.object,
//   tabs: PropTypes.array,
// };
