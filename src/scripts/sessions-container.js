//Vendors
import React from 'react';
import ReactDOM from 'react-dom';
// import * as general from './components/general.js';
import Sessions from './react-components/session';
import {getSessions, saveSessions} from './components/getsetSessions';
//Styles
// import '../styles/fontawesome5/fa-solid.scss';
// import '../styles/fontawesome5/fa-light.scss';
// import '../styles/fontawesome5/fa-regular.scss';
// import '../styles/fontawesome5.scss';
import '../styles/eg.scss';

$(document).ready(function() {
  $('.collapse').collapse();
  window.sessions = ReactDOM.render(<Sessions />, document.getElementById('all-sessions'));
  getSessions().then(items => window.sessions.setState({ data: items }));

  $('#saveSessions-btn').on('click', function(e) {
    e.preventDefault();
    saveSessions(sessions);
  });

  $('#saveSessionsAndClose-btn').on('click', function() {
    packagedAndBroadcast(sender, 'background', 'saveSessionsAndClose', null);
  });
});
