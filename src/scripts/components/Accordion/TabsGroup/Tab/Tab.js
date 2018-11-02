let debug = require('debug')('tab');
import React from 'react';
import PropTypes from 'prop-types';
import {log} from '../../../general';

export default class Tab extends React.Component {
  constructor(props) {
    debug('Tab constructor');
    super(props);
    this.state = {...this.props,checked:false};
    // {id}: this.props,
    //   key: this.props.key,
    //   url: this.props.url,
    //   title: this.props.title,
    //   pinned: this.props.pinned,
    //   position: this.props.position,
    //   favicon: this.props.favIconUrl,
    //   audible: this.props.audible,
    //   muted: this.props.muted,
    //   status: this.props.status,
    //   checked: false
    // {id, key, url, title, pinned, position, favicon, audible, muted, status}: this.props,
    // };
    this.isSelected = this.isSelected.bind(this);
  }
  focusTab(id) {
    browser.tabs.update(id, { active: true });
  }
  isSelected(event){
    const value = event.target.checked;
    this.setState({checked: value});
    this.props.updateSelectedTabs(this.props.id,this.state.checked);
  }
  componentWillReceiveProps(props) {
    debug("Tab.js getting new props:",props);
  }
  componentWillUnmount(){
    debug("Tab.js unmounting:");
  }
  componentDidUpdate(props,state,snapshot){

  }
  componentWillReceiveProps(props) {
    // log(props.muted);
    this.setState({id: props.id});
    this.setState({key: props.key});
    this.setState({url: props.url});
    this.setState({title: props.title});
    this.setState({pinned: props.pinned});
    this.setState({position: props.position});
    this.setState({favicon: props.favIconUrl});
    this.setState({audible: props.audible});
    this.setState({muted: props.muted});
    this.setState({status: props.status});
    this.setState({data: props.data});
  }
  render() {
    debug('Tab.js: render');
    let url = this.state.url;
    let checked = this.state.checked;
    let pinned = this.state.pinned;
    let loading = this.state.status=='loading';
    let audible = this.state.audible || this.state.muted;
    return (
      <li key={this.props.id} data-id={this.props.id} className={`tab-item` + (checked ? ` checked` : ` `)+ (loading ? ` loading` : ` `)}>
        <label className="tab-favicon" aria-label="favicon">
          <img src={this.state.favicon} />
          <input type="checkbox" onChange={this.isSelected.bind(this)} className="checkbox"/>
        </label>
        <a title={url} className="clickable tab-name" onClick={this.focusTab.bind(null, this.props.id)}>
          {this.state.title}
        </a>
        <span className="tab-url trimmed dimmed">{url}</span>
        <ul className=" tab-actions" role="group" aria-label="options">
          {/* <li title="Tab Information" className="clickable">
            onClick={this.infoModal.bind(null, this.state.data)}
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

          <li
            title="Un/Mute Tab"
            className={`clickable sound-tab` + (audible ? ` active` : ` disabled`)}
            onClick={() => this.props.toggleMute(this.props.id)}
          >
            <i className={`fa fw-fw ` + (!this.state.muted ? ` fa-volume-up` : ` fa-volume-mute`)} />
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
  status: PropTypes.string
};
