import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Tab from './Tab/index';
import {log} from '../../general';

export default class TabsGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // tabs:this.props.tabs,
      // preferences: this.props.preferences,
      selectedTabs: []
    };
    this.render = this.render.bind(this);
    // this.updateSelectedTabs = this.updateSelectedTabs.bind(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("Tabsgroup.js getDerivedStateFromProps:",nextProps, prevState);
    return nextProps;
  }
  componentDidMount() {
    console.log("tabsgroup mounted:",this.state.tabs);
  }
  // componentWillReceiveProps(props) {
  //   console.log("TabsGroup.js getting new props:",props.tabs);
  //   this.setState({tabs: props.tabs});
  // }
  render() {
    console.log("tabgroup this props children",this.state.tabs,this.props.children);
    return (<TransitionGroup component="ul" className="tab tabs-list sortable selectable">
              {this.props.children}
            </TransitionGroup>)



  }
}
TabsGroup.propTypes = {
  preferences: PropTypes.object,
  tabs: PropTypes.array,
};