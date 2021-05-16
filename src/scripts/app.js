import "react-devtools";
import React from "react";
import {render} from "react-dom";
//Redux
import {Provider} from "react-redux";
import store from "./store";
import ActiveTabs from "./ActiveTabs";

export const App = render(
  <Provider store={store}>
    <ActiveTabs/>
  </Provider>,
  document.querySelector("#root")
);
