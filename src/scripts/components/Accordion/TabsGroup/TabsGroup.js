import React from 'react';
import {Droppable} from 'react-beautiful-dnd';

const TabsGroup = () => {
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
};
export default TabsGroup;

