import React from 'react';

import {sortTabs} from '../general.js';
import Search from './Search/index';
import WindowSelector from '../WindowSelector';
//Images
let logo;
NODE_ENV === 'production'
  ? (logo = require('../../../images/logo.svg'))
  : (logo = require('../../../images/dev-logo.svg'));

const Header = props => {
  const sortBy = parameter => {
    sortTabs(parameter, props.tabs);
  };
  return (
    <header className="page-header" key={'header'}>
      <nav className="navbar">
        <div className="navbar-brand ">
          <a href="#" className="pull-left logo" style={{marginTop: '10px'}}>
            <img src={logo} alt="" style={{height: '40px', width: 'auto'}}/>
          </a>
        </div>
        <div className="collapse navbar-collapse" id="navbarNav">
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
                  ? this.processSelectedTabs('selectAll', props.tabs.map(tab => tab.id))
                  : this.processSelectedTabs('selectNone', props.tabs.map(tab => tab.id));

                this.setState({allSelected: !props.allSelected});
              }}
              title="Select All"
            >
              <input type="checkbox" checked={props.allSelected} readOnly/>
            </a>
          </li>

          <li className="nav-item dropdown">
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
                <i className="fal fa-sort"/>
              </a>
              <div className="input-group-append" id="button-addon4">
                <button
                  className="btn btn-link text-white"
                  type="button"
                  title="Pin Selected"
                  onClick={() => sortBy('title')}
                >
                  Title
                </button>
                <button
                  className="btn btn-link text-white"
                  type="button"
                  title="Unpin Selected"
                  onClick={() => sortBy('url')}
                >
                  URL
                </button>
              </div>
            </div>
          </li>
          <WindowSelector/>
        </ul>
        <div className="nav context-actions selection-action">
          <div className="input-group" style={{width: 'auto', marginRight: '15px'}}>
            <a
              className="form-control"
              onClick={() => this.processSelectedTabs('togglePinSelected')}
              href="#"
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
                onClick={() => this.processSelectedTabs('unpinSelected')}
                style={{backgroundColor: 'white'}}
              >
                <i className="fal fa-map-marker-slash"/>
              </button>
              <button
                className="btn btn-default"
                type="button"
                title="Pin Selected"
                onClick={() => this.processSelectedTabs('pinSelected')}
                style={{backgroundColor: 'white'}}
              >
                <i className="fas fa-map-marker fa-fw"/>
              </button>
            </div>
          </div>
          <div className="input-group" style={{width: 'auto', marginRight: '15px'}}>
            <a
              className="form-control"
              onClick={() => this.processSelectedTabs('toggleMuteSelected')}
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
                onClick={() => this.processSelectedTabs('muteSelected')}
                style={{backgroundColor: 'white'}}
              >
                <i className="fal fa-volume-slash"/>
              </button>
              <button
                className="btn btn-default"
                type="button"
                title="Unmute Selected"
                onClick={() => this.processSelectedTabs('unmuteSelected')}
                style={{backgroundColor: 'white'}}
              >
                <i className="fas fa-volume-up"/>
              </button>
            </div>
          </div>
          <button
            className="btn btn-default"
            type="button"
            title="Close Selected"
            onClick={() => this.processSelectedTabs('closeSelected')}
            style={{backgroundColor: 'white'}}
          >
            <i className="fas fa-times text-danger"/>
          </button>
          <div className="dropdown">
            <a
              className="btn btn-secondary dropdown-toggle"
              onClick={() => this.processSelectedTabs('')}
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              With Selected
            </a>

            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <a className="dropdown-item" href="#" onClick={() => this.processSelectedTabs('toNewWindow')}>
                Move to New Window
              </a>
              <a className="dropdown-item" href="#" onClick={() => this.processSelectedTabs('toSession')}>
                Make Session/Saved Tabs
              </a>
            </div>
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
              <i className="fas fa-sync-alt fa-fw fa-sm"/>
            </a>
          </li>
          <li style={{marginRight: 18}} className="nav-item">
            <a
              href="#"
              onClick={() => {
                !props.allPinned
                  ? this.processSelectedTabs('pinSelected', this.filterTabs().map(tab => tab.id))
                  : this.processSelectedTabs('unpinSelected', this.filterTabs().map(tab => tab.id));
                this.setState({allPinned: !props.allPinned});
              }}
              title={!props.allPinned ? `Pin All` : `Unpin All`}
              className="nav-link"
            >
              <i className={!props.allPinned ? `far fa-thumbtack` : `fa fa-thumbtack`}/>
            </a>
          </li>
          <li style={{marginRight: 18}} className="nav-item">
            <a
              href="#"
              className="nav-link"
              onClick={() => {
                !props.allMuted
                  ? this.processSelectedTabs('muteSelected', this.filterTabs().map(tab => tab.id))
                  : this.processSelectedTabs('unmuteSelected', this.filterTabs().map(tab => tab.id));
                this.setState({allMuted: !props.allMuted});
              }}
              title={!props.allMuted ? `Mute All` : `Unmute All`}
            >
              <i className={`fal fa-fw ` + (!props.allMuted ? `fa-volume-up` : `fa-volume-up-slash`)}/>
            </a>
          </li>
          <li style={{marginRight: 0}} className="nav-item">
            <a
              href="#"
              title="Close All"
              className="nav-link"
              onClick={() => this.processSelectedTabs('closeSelected', this.filterTabs().map(tab => tab.id))}
            >
              <i className="fal fa-times fw-fw"/>
            </a>
          </li>
        </ul>
      </section>
    </header>
  );
};
export default Header;
