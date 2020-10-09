/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import React from 'react';
import {FontAwesomeIcon as FA} from '@fortawesome/react-fontawesome';
import {faSort} from '@fortawesome/free-solid-svg-icons/faSort';
import {faVolumeOff} from '@fortawesome/free-solid-svg-icons/faVolumeOff';
import {faVolumeMute} from '@fortawesome/free-solid-svg-icons/faVolumeMute';
import {faVolumeUp} from '@fortawesome/free-solid-svg-icons/faVolumeUp';
import {faShareSquare} from '@fortawesome/free-solid-svg-icons/faShareSquare';
import {faSave} from '@fortawesome/free-solid-svg-icons/faSave';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faSyncAlt} from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import {faThumbtack, faThumbtack as fasThumbtack} from '@fortawesome/free-solid-svg-icons/faThumbtack';
import {connect} from 'react-redux';

import {sortTabs} from '../general.js';
import Search from './Search/index';
import WindowSelector from '../WindowSelector';
import Brand from "../../Brand";
import * as PropTypes from "prop-types";
//Images
let logo = require(`../../../images/${NODE_ENV !== 'production' && 'dev'}-logo.png`);

function Navigation(props) {
  return <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav">
      <li className="nav-item active">
        <a className="nav-link text-white font-weight-bold" href="/tabs.html" id="go-to-tabs">
          Tabs
          <span
            className={`active-tab-counter badge ` + (props.tabs.length > 50 ? 'badge-danger' : 'badge-success')}
          >
                  {props.tabs.length ? props.tabs.length : ''}
                </span>
          <span className="sr-only">(current)</span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link text-white" href="/sessions.html">
          Sessions
        </a>
      </li>
    </ul>
  </div>
}

Navigation.propTypes = {tabs: PropTypes.any}

const Header = props => {
  const sortBy = parameter => {
    sortTabs(parameter, props.tabs);
  };
  let iconPinned = props.allPinned ? <FA icon={faThumbtack}/> : <FA icon={fasThumbtack}/>;
  let iconSound = props.allMuted ? <FA icon={faVolumeOff}/> : <FA icon={faVolumeMute}/>;
  return (
    <header className="page-header" key={'header'}>
      <nav className="navbar">
        {Brand(logo)}
        {Navigation(props)}

        <Search
          regex={props.preferences.search.regex}
          ignoreCase={props.preferences.search.ignoreCase}
          searchIn={props.preferences.search.searchIn}
          searchInTabs={props.searchInTabs}
          setPreferences={props.setPreferences}
        />
      </nav>
      <section className="context-actions navbar container-fluid" id="selection-action">
        <ul className="nav nav-pills pull-left">
          <li className="nav-item">
            <a
              className="nav-link"
              onClick={() => {
                !this.state.allSelected
                  ? props.processSelectedTabs('selectAll', props.tabs.map(tab => tab.id))
                  : props.processSelectedTabs('selectNone', props.tabs.map(tab => tab.id));

                this.setState({allSelected: !props.allSelected});
              }}
              title="Select All"
            >
              <input type="checkbox" checked={props.allSelected} readOnly/>
            </a>
          </li>

          <li className="nav-item dropdown" key={"sortSection"}>
            <div
              className="input-group"
              style={{
                width: 'auto',
                marginRight: '15px',
                border: '1px solid #7cbbff',
              }}
            >
              <a
                className="form-control bg-transparent text-white"
                href="#"
                title="Sort Tabs"
                style={{border: 'none'}}
              >
                <FA icon={faSort}/>
              </a>
              <div className="input-group-append" id="button-addon4">
                <button
                  className="btn btn-link text-white"
                  type="button"
                  title="Sort by Title"
                  onClick={() => sortBy('title')}
                >
                  Title
                </button>
                <button
                  className="btn btn-link text-white"
                  type="button"
                  title="Sort by URL"
                  onClick={() => sortBy('url')}
                >
                  URLs
                </button>
              </div>
            </div>
          </li>
          <WindowSelector key={'windowSelector'}/>
        </ul>
        <div className="nav context-actions selection-action">
          <div className="input-group" style={{width: 'auto', marginRight: '15px'}}>
            <a
              className="form-control"
              onClick={() => props.processSelectedTabs('togglePinSelected')}
              // href="#"
              title="Toggle Pin selected tab"
              style={{border: 'none'}}
            >
              Un/Pin Selected
            </a>
            <div className="input-group-append" id="button-addon4">
              <button
                className="btn btn-default"
                type="button"
                title="Unpin Selected"
                onClick={() => props.processSelectedTabs('unpinSelected')}
                style={{backgroundColor: 'white'}}
              >
                <FA icon={faThumbtack}/>
              </button>
              <button
                className="btn btn-default"
                type="button"
                title="Pin Selected"
                onClick={() => props.processSelectedTabs('pinSelected')}
                style={{backgroundColor: 'white'}}
              >
                <FA icon={fasThumbtack}/>
              </button>
            </div>
          </div>
          <div className="input-group" style={{width: 'auto', marginRight: '15px'}}>
            <a
              className="form-control"
              onClick={() => props.processSelectedTabs('toggleMuteSelected')}
              href="#"
              title="Toggle Pin selected tab"
              style={{border: 'none'}}
            >
              Un/Mute Selected
            </a>
            <div className="input-group-append" id="button-addon4">
              <button
                className="btn btn-default"
                type="button"
                title="Mute Selected"
                onClick={() => props.processSelectedTabs('muteSelected')}
                style={{backgroundColor: 'white'}}
              >
                <FA icon={faVolumeMute}/>
              </button>
              <button
                className="btn btn-default"
                type="button"
                title="Unmute Selected"
                onClick={() => props.processSelectedTabs('unmuteSelected')}
                style={{backgroundColor: 'white'}}
              >
                <FA icon={faVolumeUp}/>
                <i className="fas fa-volume-up"/>
              </button>
            </div>
          </div>
          <button
            className="btn btn-default"
            type="button"
            title="Close Selected"
            onClick={() => props.processSelectedTabs('closeSelected')}
            style={{backgroundColor: 'white'}}
          >
            <FA icon={faTimes} className={'text-danger'}/>
          </button>
          <div className={'input-group-append'}>
            <button className="btn btn-default" onClick={() => props.processSelectedTabs('toNewWindow')}>
              <FA icon={faShareSquare}/>
            </button>
            <button className="btn btn-default" onClick={() => props.processSelectedTabs('toSession')}>
              <FA icon={faSave}/>
            </button>
          </div>
        </div>
        <ul className="nav nav-pills">
          <li role="presentation" className="nav-item">
            <a
              className="nav-link refreshActiveTabs"
              title="Refresh Excited Gem Tabs"
              href="#"
              onClick={() => {
                updateTabs();
                this.setState({tabs: props.tabs});
              }}
            >
              <FA icon={faSyncAlt} fixedWidth/>
            </a>
          </li>
          <li style={{marginRight: 18}} className="nav-item">
            <a
              href="#"
              onClick={() => {
                !props.allPinned
                  ? props.processSelectedTabs('pinSelected', this.filterTabs().map(tab => tab.id))
                  : props.processSelectedTabs('unpinSelected', this.filterTabs().map(tab => tab.id));
                this.setState({allPinned: !props.allPinned});
              }}
              title={!props.allPinned ? `Pin All` : `Unpin All`}
              className="nav-link"
            >
              {iconPinned}
            </a>
          </li>
          <li style={{marginRight: 18}} className="nav-item">
            <a
              href="#"
              className="nav-link"
              onClick={() => {
                !props.allMuted
                  ? props.processSelectedTabs('muteSelected', this.filterTabs().map(tab => tab.id))
                  : props.processSelectedTabs('unmuteSelected', this.filterTabs().map(tab => tab.id));
                this.setState({allMuted: !props.allMuted});
              }}
              title={!props.allMuted ? `Mute All` : `Unmute All`}
            >
              {iconSound}
            </a>
          </li>
          <li style={{marginRight: 0}} className="nav-item">
            <a
              href="#"
              title="Close All"
              className="nav-link"
              onClick={() => props.processSelectedTabs('closeSelected', this.filterTabs().map(tab => tab.id))}
            >
              <FA icon={faTimes}/>
            </a>
          </li>
        </ul>
      </section>
    </header>
  );
};

const mapDispatchToProps = dispatch => ({
  searchInTabs: searchTerm => dispatch(ACTIONS.searchInTabs(searchTerm)),
  toggleSearchInAction: searchInArray => dispatch(ACTIONS.toggleSearchInAction(searchInArray)),
});
export default connect(null, mapDispatchToProps)(Header);
