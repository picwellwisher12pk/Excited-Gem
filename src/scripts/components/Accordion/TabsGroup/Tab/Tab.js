// let console.log = require('console.log')('tab');
import React,{Component,Fragment} from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {log} from '../../../general';
let browser = require("webextension-polyfill");

export default class Tab extends Component {
  constructor(props) {
    // console.log('Tab constructor');
    super(props);
    this.isChecked = this.isChecked.bind(this);
  }
  focusTab(id) {
    browser.tabs.update(id, { active: true });
  }
  isChecked(event){
    const value = event.target.checked;
    console.log("tabjs. this is checked",value);
    // this.setState({checked: value});
    this.props.updateSelectedTabs(this.props.id,value);
  }
  componentWillReceiveProps(props) {
    // console.log("Tab.js getting new props:",props);
  }
  componentWillUnmount(){
    // console.log("Tab.js unmounting:");
  }
  componentDidUpdate(props,state,snapshot){
    // console.log("Tab.js updated",props,state);
  }
  componentWillReceiveProps(props) {
  }

  render() {
    let title = this.props.title;
    let url = this.props.url;
    if(window.searchTerm){
      let regex = new RegExp(window.searchTerm,'gi');
       title = this.props.title.replace(regex,`<mark>${window.searchTerm}</mark>`);
       url = this.props.url.replace(regex,`<mark>${window.searchTerm}</mark>`);
      console.log("title url postprocess",title,url);
    }
    let checked = this.props.checked;
    let pinned = this.props.pinned;
    let loading = this.props.status=='loading';
    let discarded = this.props.discarded;
    let audible = this.props.audible || this.props.muted;
    return (
      <Draggable draggableId={this.props.id} key={this.props.id} data-id={this.props.id} id={this.props.id} index={this.props.position} className={`tab-item` + (checked ? ` checked` : ` `)+ (loading||discarded ? ` idle` : ` `)}>
      {(provided,snapshot)=>{
       return <li
       {...provided.draggableProps}
       {...provided.dragHandleProps}
  ref={provided.innerRef}
      id={`draggable-`+this.props.position}

       // draggableId={this.props.id}
       className={`tab-item` + (checked ? ` checked` : ` `)+ (loading||discarded ? ` idle` : ` `)}
       >
        <label className="tab-favicon" aria-label="favicon">
          <img src={this.props.favIconUrl} />
          <input type="checkbox" onChange={this.isChecked.bind(this)} checked={this.props.checked} className="checkbox"/>
        </label>
        <a title={url} className="clickable tab-name" onClick={this.focusTab.bind(null, this.props.id)}
        dangerouslySetInnerHTML={{ __html: title }}
        />
        <span className="tab-url trimmed dimmed" dangerouslySetInnerHTML={{ __html: url }} onClick={this.focusTab.bind(null, this.props.id)}/>
        <ul className=" tab-actions" role="group" aria-label="options">
          {/* <li title="Tab Information" className="clickable">
            onClick={this.infoModal.bind(null, this.props.data)}
          <i className="fa fa-info-circle fw-fw" />
          </li> */}
          <li
            title="Un/Pin Tab"
            className={`clickable pin-tab` + (pinned ? ` active` : ` disabled`)}
            onClick={() =>this.props.togglePin(this.props.id)}
            aria-label="pinned"
          >
            <i className="fa fa-thumbtack fw-fw" />
          </li>

          <li title="Un/Mute Tab"
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
      }}

      </Draggable>
    );
  }
}

Tab.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  pinned: PropTypes.bool,
  position: PropTypes.number,
  favicon: PropTypes.string,
  audible:PropTypes.bool,
  status: PropTypes.string,
  checked: PropTypes.bool
};
