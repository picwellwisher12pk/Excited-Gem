//Vendors
const $ = (jQuery = require('jquery'));
const bootstrap = require('bootstrap');
import React from 'react';
import ReactDOM from 'react-dom';
import * as general from './components/general.js';
import Sessions from './react-components/session.js';
import { saveSessions, getSessions } from './components/getsetSessions.js';

//Styles
import '../styles/fontawesome5/fa-solid.scss';
import '../styles/fontawesome5/fa-regular.scss';
import '../styles/fontawesome5.scss';
import '../styles/eg.scss';

$(document).ready(function() {
  let sessions = ReactDOM.render(<Sessions />, document.getElementById('all-sessions'));
  // sessions.setState({data : getSessions()});
  getSessions(sessions);

  $('#saveSessions-btn').on('click', function(e) {
    e.preventDefault();
    saveSessions();
  });

  $('#saveSessionsAndClose-btn').on('click', function() {
    packagedAndBroadcast(sender, 'background', 'saveSessionsAndClose', null);
  });
});
