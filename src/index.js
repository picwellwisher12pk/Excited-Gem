import "react-devtools";
import React from "react";
import { render } from "react-dom";
//Redux
import { Provider } from "react-redux";
import configureStore from "./modules/store";
import ACTIONS from "./modules/action";

import ActiveTabs from "./ActiveTabs";

var browser = require("webextension-polyfill");

function updateTabs(store, eventName) {
  store.dispatch(ACTIONS.updateActiveTabs(eventName));
}

let TabsApp;
configureStore().then((store) => {
  TabsApp = render(
    <Provider store={store}>
      <ActiveTabs />
    </Provider>,
    document.querySelector("#root")
  );
});
