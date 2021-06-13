import React, { useState } from "react";
import VolumeOffIcon from "volume-off.svg";
import VolumeIcon from "volume.svg";
import VolumeSlashIcon from "volume-slash.svg";
import TimesIcon from "times.svg";
import ThumbtackIcon from "pin-icon.svg";
import SortIcon from "sort.svg";
import SaveIcon from "save.svg";
import SyncAltIcon from "sync-alt.svg";
import Thumbstack from "thumbtack.svg";
import { connect, useSelector, useDispatch } from "react-redux";
// import { updateSelectedTabs } from "../../tabSlice.js";

import { sortTabs } from "../general.js";
import WindowSelector from "../WindowSelector";
let browser = require("webextension-polyfill");

//Images
let logo = require(`../../../images/${
  NODE_ENV !== "production" && "dev"
}-logo.png`);

const Header = (props) => {
  const selectedTabs = useSelector((state) => state.tabs.selectedTabs);
  const [allSelected, setAllSelected] = useState(props.allSelected);
  const [allPinned, setAllPinned] = useState(props.allPinned);
  const [allMuted, setAllMuted] = useState(props.allMuted);
  const sortBy = (parameter) => {
    sortTabs(parameter, props.tabs);
  };
  let iconPinned = props.allPinned ? (
    <Thumbstack style={{ height: 16, fill: "white" }} />
  ) : (
    <Thumbstack style={{ height: 16, fill: "white" }} />
  );
  let iconSound = props.allMuted ? (
    <VolumeIcon style={{ height: 16, fill: "white" }} />
  ) : (
    <VolumeSlashIcon style={{ height: 16, fill: "white" }} />
  );
  return (
    <header className="page-header" key={"header"}>
      <nav className="navbar">
        <div className="navbar-brand ">
          <a href="#" className="pull-left logo" style={{ marginTop: "10px" }}>
            <img
              src={logo.default}
              alt=""
              style={{ height: "40px", width: "auto" }}
            />
          </a>
        </div>
        <div className="d-flex flex-grow-1" id="navbarNav">
          <ul className="d-flex">
            <li className="nav-item active">
              <a
                className="nav-link text-white font-weight-bold"
                href="/tabs.html"
                id="go-to-tabs"
              >
                Tabs{" "}
                <span
                  className={
                    `active-tab-counter badge ` +
                    (props.tabs > 50 ? "badge-danger" : "badge-success")
                  }
                >
                  {props?.tabs?.length}
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
        {props.children}
        {/* {Brand(logo)} */}
        {/* {Navigation(props)}

        <Search
          regex={props.preferences.search.regex}
          ignoreCase={props.preferences.search.ignoreCase}
          searchIn={props.preferences.search.searchIn}
          searchInTabs={props.searchInTabs}
          setPreferences={props.setPreferences}
        /> */}
      </nav>
      <section
        className="context-actions navbar container-fluid"
        id="selection-action"
      >
        <ul className="nav nav-pills pull-left">
          <li className="nav-item">
            <a
              className="nav-link"
              onClick={() => {
                props.processSelectedTabs(
                  allSelected ? "selectAll" : "selectNone",
                  props.tabs.map((tab) => tab.id)
                );
                setAllSelected(!allSelected);
              }}
              title="Select All"
            >
              <input type="checkbox" checked={props.allSelected} readOnly />
            </a>
          </li>

          <li className="nav-item dropdown" key={"sortSection"}>
            <div
              className="input-group"
              style={{
                width: "auto",
                marginRight: "15px",
                borderRadius: "4px",
                border: "1px solid #7cbbff",
              }}
            >
              <a
                className="form-control bg-transparent text-white"
                href="#"
                title="Sort Tabs"
                style={{ border: "none" }}
              >
                <SortIcon style={{ height: 16 }} />
              </a>
              <div className="input-group-append" id="button-addon4">
                <button
                  className="btn btn-link text-white"
                  type="button"
                  title="Sort by Title"
                  onClick={() => sortBy("title")}
                >
                  Title
                </button>
                <button
                  className="btn btn-link text-white"
                  type="button"
                  title="Sort by URL"
                  onClick={() => sortBy("url")}
                >
                  URLs
                </button>
              </div>
            </div>
          </li>
          <WindowSelector key={"windowSelector"} />
        </ul>
        <div className="nav context-actions selection-action">
          <div
            className="input-group"
            style={{ width: "auto", marginRight: "15px" }}
          >
            <a
              className="form-control"
              onClick={() => props.processSelectedTabs("togglePinSelected")}
              title="Toggle Pin selected tab"
              style={{ border: "none" }}
            >
              Un/Pin Selected
            </a>
            <div className="input-group-append" id="button-addon4">
              <button
                className="btn btn-default"
                type="button"
                title="Unpin Selected"
                onClick={() => props.processSelectedTabs("unpinSelected")}
                style={{ backgroundColor: "white" }}
              >
                <ThumbtackIcon style={{ height: 16 }} />
              </button>
              <button
                className="btn btn-default"
                type="button"
                title="Pin Selected"
                onClick={() => props.processSelectedTabs("pinSelected")}
                style={{ backgroundColor: "white" }}
              >
                <ThumbtackIcon style={{ height: 16 }} />
              </button>
            </div>
          </div>
          <div
            className="input-group"
            style={{ width: "auto", marginRight: "15px" }}
          >
            <a
              className="form-control"
              onClick={() => props.processSelectedTabs("toggleMuteSelected")}
              href="#"
              title="Toggle Pin selected tab"
              style={{ border: "none" }}
            >
              Un/Mute Selected
            </a>
            <div className="input-group-append" id="button-addon4">
              <button
                className="btn btn-default"
                type="button"
                title="Mute Selected"
                onClick={() => props.processSelectedTabs("muteSelected")}
                style={{ backgroundColor: "white" }}
              >
                <VolumeSlashIcon style={{ height: 16 }} />
              </button>
              <button
                className="btn btn-default"
                type="button"
                title="Unmute Selected"
                onClick={() => props.processSelectedTabs("unmuteSelected")}
                style={{ backgroundColor: "white" }}
              >
                <VolumeIcon style={{ height: 16 }} />
                <i className="fas fa-volume-up" />
              </button>
            </div>
          </div>
          <button
            className="btn btn-default"
            type="button"
            title="Close Selected"
            onClick={() => props.processSelectedTabs("closeSelected")}
            style={{ backgroundColor: "white" }}
          >
            <TimesIcon style={{ height: 16, fill: "white" }} />
          </button>
          <div className={"input-group-append"}>
            {/* <button
              className="btn btn-default"
              onClick={() => props.processSelectedTabs("toNewWindow")}
            >
              <FA icon={faShareSquare} />
            </button> */}
            <button
              className="btn btn-default"
              onClick={() => props.processSelectedTabs("toSession")}
            >
              <SaveIcon style={{ height: 16, fill: "white" }} />
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
                this.setState({ tabs: props.tabs });
              }}
            >
              <SyncAltIcon style={{ height: 16, fill: "white" }} />
            </a>
          </li>
          <li style={{ marginRight: 18 }} className="nav-item">
            <a
              onClick={() => {
                props.processSelectedTabs(
                  !props.allPinned ? "pinSelected" : "unpinSelected",
                  this.filterTabs().map((tab) => tab.id)
                );
                setAllPinned(!allPinned);
              }}
              title={!props.allPinned ? `Pin All` : `Unpin All`}
              className="nav-link"
            >
              {iconPinned}
            </a>
          </li>
          <li style={{ marginRight: 18 }} className="nav-item">
            <a
              href="#"
              className="nav-link"
              onClick={() => {
                props.processSelectedTabs(
                  !props.allMuted ? "muteSelected" : "unmuteSelected",
                  this.filterTabs().map((tab) => tab.id)
                );
                this.setState({ allMuted: !props.allMuted });
              }}
              title={!props.allMuted ? `Mute All` : `Unmute All`}
            >
              {iconSound}
            </a>
          </li>
          <li style={{ marginRight: 0 }} className="nav-item">
            <a
              href="#"
              title="Close All"
              className="nav-link"
              onClick={() => {
                let ids =
                  selectedTabs.length === 0
                    ? window.filteredTabs.map((tab) => tab.id)
                    : selectedTabs;
                browser.tabs.remove(ids);
              }}
            >
              <TimesIcon style={{ height: 16, fill: "white" }} />
            </a>
          </li>
        </ul>
      </section>
    </header>
  );
};

const mapDispatchToProps = (dispatch) => ({
  searchInTabs: (searchTerm) => dispatch(ACTIONS.searchInTabs(searchTerm)),
  toggleSearchInAction: (searchInArray) =>
    dispatch(ACTIONS.toggleSearchInAction(searchInArray)),
});
export default connect(null, mapDispatchToProps)(Header);
