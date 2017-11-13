require( 'jquery');
require('bootstrap');
import React from "react";
import ReactDOM from "react-dom";

import Sessions from "./react-components/sessions-react.jsx";
import packagedAndBroadcast from "./components/communications.js";
import { saveSessions, getSessions } from "./components/getsetSessions.jsx";
//Styles
import "../styles/bootstrap.scss";
import "../styles/eg.scss";

var sender = 'content';

let sessions = Sessions;

$(document).ready(function () {
    sessions = ReactDOM.render(React.createElement(Sessions, null), document.getElementById('all-sessions'));
    getSessions();
    $("#saveSessions-btn").on('click', function (e) {
        e.preventDefault();
        packagedAndBroadcast(sender, 'background', 'saveSessions', null);
    });
    $("#saveSessionsAndClose-btn").on('click', function () {
        packagedAndBroadcast(sender, 'background', 'saveSessionsAndClose', null);
    });
});