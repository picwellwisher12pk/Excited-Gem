require( 'jquery');
require('bootstrap');
import React from "react";
import ReactDOM from "react-dom";

import * as general from "./components/general.js";
import Sessions from "./react-components/sessions.rc.jsx";
import packagedAndBroadcast from "./components/communications.js";
import { saveSessions, getSessions } from "./components/getsetSessions.jsx";
//Styles
import "../styles/bootstrap.scss";
import "../styles/eg.scss";

const sender = 'content';

let sessions = Sessions;

$(document).ready(function () {
  sessions = ReactDOM.render(<Sessions />, document.getElementById("all-sessions"));
  getSessions(sessions);


    $("#saveSessions-btn").on('click', function (e) {
        e.preventDefault();
        packagedAndBroadcast(sender, 'background', 'saveSessions', null);
    });

    $("#saveSessionsAndClose-btn").on('click', function () {
        packagedAndBroadcast(sender, 'background', 'saveSessionsAndClose', null);
    });
});
