// import "react-devtools";
import React from "react";
import * as reactDOM from "react-dom/client";
const { createRoot } = reactDOM;
//Redux
import * as reactRedux from "react-redux";
const Provider = reactRedux.Provider;
console.log("react-redux", reactRedux);
import store from "~/scripts/store";
import ActiveTabs from "~/scripts/ActiveTabs";

import "~/index.css";
import "antd/dist/antd.css";
import "~/styles/index.scss";
import "react-custom-scroll/dist/customScroll.css";

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", function () {
//     navigator.serviceWorker.register("background-wrapper.js").then(
//       function (registration) {
//         // Registration was successful
//         console.log(
//           "ServiceWorker registration successful with scope: ",
//           registration.scope
//         );
//       },
//       function (err) {
//         // registration failed :(
//         console.log("ServiceWorker registration failed: ", err);
//       }
//     );
//   });
// }
const root = createRoot(document.getElementById("root")); // createRoot(container!) if you use TypeScript
root.render(
  <Provider store={store}>
    <ActiveTabs />
  </Provider>
);
