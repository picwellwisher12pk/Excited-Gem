// import "react-devtools";
import React from "react";
import { render } from "react-dom";
//Redux
import { Provider } from "react-redux";
import store from "./store";
import ActiveTabs from "./ActiveTabs";

const style = require("@/styles/index.scss");
const customScroll = require("/node_modules/react-custom-scroll/dist/customScroll.css");

let browser = require("webextension-polyfill");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("background-wrapper.js").then(
      function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

render(
  <Provider store={store}>
    <ActiveTabs />
  </Provider>,
  document.querySelector("#root")
);
