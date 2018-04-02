//Vendors
const $ = (jQuery = require('jquery'));
// import "./vendor/jquery.min.js";/*?*/
const bootstrap = require('bootstrap');
// const fontawesome5Light = require ( "./vendor/fontawesome5/fa-light.min");
// const fontawesome5Solid = require ( "./vendor/fontawesome5/fa-solid.min");
// const fontawesome5all = require ( "./vendor/fontawesome5/fontawesome-all.min");
import React from 'react';
import ReactDOM from 'react-dom';

import * as general from './components/general.js';
import Sessions from './react-components/session.js';
import packagedAndBroadcast from './components/communications.js';
import { saveSessions, getSessions } from './components/getsetSessions.js';
//Styles
import '../styles/bootstrap.scss';
import '../styles/fontawesome5.scss';
import '../styles/eg.scss';

const sender = 'content';

// let sessions = Sessions;

$(document).ready(function() {
  let sessions = ReactDOM.render(<Sessions />, document.getElementById('all-sessions'));
  getSessions(sessions);

  $('#saveSessions-btn').on('click', function(e) {
    e.preventDefault();
    packagedAndBroadcast(sender, 'background', 'saveSessions', null);
  });

  $('#saveSessionsAndClose-btn').on('click', function() {
    packagedAndBroadcast(sender, 'background', 'saveSessionsAndClose', null);
  });
});
