// import "react-devtools";
import React from "react";
import { createRoot } from "react-dom/client";
//Redux
import { Provider } from "react-redux";
import store from "~/scripts/store";
import ActiveTabs from "~/scripts/ActiveTabs";

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
