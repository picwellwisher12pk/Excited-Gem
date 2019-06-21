import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Tab from './Tab/index';
import { log } from '../../general';

export default class TabsGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabs: [],
    };
    this.render = this.render.bind(this);
  }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // console.log("Tabsgroup.js getDerivedStateFromProps:",nextProps, prevState);
  //   // return nextProps;
  // }
  componentDidMount() {
    console.log('tabsgroup mounted:', this.state.tabs);
  }

  render() {
    // console.log("tabgroup this props children",this.state.tabs,this.props.children);
    const animated = `<TransitionGroup component="ul" className="tab tabs-list sortable selectable">
              ${this.props.children}
            </TransitionGroup>`;

    return (
      <ul className="tab tabs-list sortable selectable" id={'droppableUL'}>
        {this.props.children}
      </ul>
    );
  }
}
TabsGroup.propTypes = {
  preferences: PropTypes.object,
  tabs: PropTypes.array,
};
