import React, { useCallback, useEffect, useState } from "react";
var browser = require("webextension-polyfill");
import { updateTabs, getTabs, setTabCountInBadge } from "./browserActions";
let config = {
  tabsfrom: "current",
};
const WindowSelector = () => {
  const [dropdownVisible, setDropDown] = useState(false);
  const [windowCount, setWindowCount] = useState(1);
  const [browserWindows, setBrowserWindows] = useState([]);
  const [currentWindow, setCurrentWindow] = useState({});

  const setWindow = (window) => {
    config.tabsfrom = window;
    getTabs();
  };
  useEffect(() => {
    browser.windows
      .getAll({
        populate: true,
        windowTypes: ["normal"],
      })
      .then((windowInfoArray) => {
        setWindowCount(windowInfoArray.length);
        setBrowserWindows(windowInfoArray);
      });
    browser.windows.getCurrent({ populate: true }).then((window) => {
      setCurrentWindow(window);
    });
  }, []);

  if (windowCount <= 1) return false;
  let currentWindowId = currentWindow.id;
  let currentWindowTabs = currentWindow.tabs ? currentWindow.tabs.length : 0;
  let totalTabCount = browserWindows.reduce(function (total, window) {
    return total + window.tabs.length;
  }, 0);
  return (
    <li
      role="presentation"
      className="nav-item dropdown d-flex dropdown flex-column justify-content-center "
    >
      <a
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        title="Show Tabs from Current/All Window(s)"
        className="nav-link dropdown-toggle"
        onClick={() => setDropDown(!dropdownVisible)}
      >
        Show Tabs From
      </a>
      <div
        className={`dropdown-menu ${dropdownVisible && "show"}`}
        style={{ width: "250px", padding: "0" }}
      >
        <ul className="list-group">
          <li className="list-group-item">
            <a
              href="#"
              className="d-flex justify-content-between align-items-center"
              onClick={setWindow("all")}
            >
              All Windows
              <span
                className={
                  `count badge badge-` +
                  (totalTabCount > 50 ? `danger` : `success`)
                }
                title="Tab Count"
              >
                {totalTabCount}
              </span>
            </a>
          </li>
          {browserWindows.map((window) => (
            <li
              className="list-group-item"
              onClick={setWindow(window.id)}
              key={window.id}
            >
              <a
                href="#"
                className={`d-flex justify-content-between align-items-center ${
                  currentWindow.id === window.id && "text-dark disabled"
                }`}
                onClick={() => {
                  if (currentWindow.id !== window.id) return false;
                  setWindow(window.id);
                }}
              >
                Window
                {currentWindow.id === window.id && (
                  <span className="count badge badge-info">current</span>
                )}
                <span
                  className={
                    `count badge badge-` +
                    (window.tabs.length > 50 ? `danger` : `success`)
                  }
                  title="Tab Count"
                >
                  {window.tabs.length}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};
export default WindowSelector;
