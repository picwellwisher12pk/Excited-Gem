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
  $('.collapse').collapse();
  let sessions = ReactDOM.render(<Sessions />, document.getElementById('all-sessions'));
  getSessions().then(items => sessions.setState({ data: items }));

  $('#saveSessions-btn').on('click', function(e) {
    e.preventDefault();
    saveSessions(sessions);
  });


});
