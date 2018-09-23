import React from 'react';
// import InfoModal from "./infomodal.jsx";
const client = browser;
// let info = ReactDOM.render(<InfoModal />,document.getElementById('infoModal'));
export default class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      key: this.props.key,
      url: this.props.url,
      title: this.props.title,
      pinned: this.props.pinned,
      position: this.props.position,
      favicon: this.props.favIconUrl,
      audible: this.props.audible,
      muted: this.props.mutedInfo,
      status: this.props.status,
      data: this.props.data,
    };
    this.muteTab = this.muteTab.bind(this);
  }
  focusTab(id) {
    client.tabs.update(id, { active: true });
  }
  pinTab(tabId, pinned) {
    !pinned ? client.tabs.update(tabId, { pinned: true }) : client.tabs.update(tabId, { pinned: false });
    this.setState({ pinned: !pinned });
  }
  muteTab() {
    client.tabs.update(this.state.id, { muted: this.state.audible });
    this.setState({ audible: !this.state.audible });
    this.setState({ muted: !this.state.muted });
  }
  componentWillReceiveProps() {}

  render() {
    let url = this.state.url;
    // let length = -1;
    // let trimmedURL = url.substring(0, length);
    let trimmedURL = url;
    let showSpeaker = this.state.audible || this.state.muted;
    return (
      <li key={this.props.id} data-id={this.props.id} className="tab-item">
        <span className="tab-favicon" aria-label="favicon">
          <img src={this.state.favicon} />
        </span>
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
            className={`clickable pin-tab` + (this.state.pinned ? ` active` : ` disabled`)}
            onClick={this.pinTab.bind(this, this.props.id, this.state.pinned)}
            aria-hidden="true"
            role="group"
            aria-label="pinned"
          >
            <i className="fa fa-thumbtack fw-fw" />
          </li>

          {/* This will not appear as status icon instead this will be just a button to trigger pin or unpin */}
          <li
            title="Un/Mute Tab"
            className={`clickable sound-tab` + (showSpeaker ? ` active` : ` disabled`)}
            onClick={this.muteTab}
            aria-hidden="true"
          >
            <i className={`fa fw-fw ` + (this.state.audible ? ` fa-volume-up` : ` fa-volume-mute`)} />
          </li>

          <li
            title="Close Tab"
            className="clickable remove-tab"
            data-id={this.props.id}
            onClick={() => this.props.closeTab(this.props.id)}
            data-command="remove"
            aria-hidden="true"
          >
            <i className="fa fa-times-circle fw-fw" />
          </li>
        </ul>
      </li>
    );
  }
}

Tab.propTypes = {
  url: React.PropTypes.string,
  title: React.PropTypes.string,
  pinned: React.PropTypes.bool,
  position: React.PropTypes.number,
  favicon: React.PropTypes.string,
  audible: React.PropTypes.bool,
  status: React.PropTypes.string,
  data: React.PropTypes.object,
};
