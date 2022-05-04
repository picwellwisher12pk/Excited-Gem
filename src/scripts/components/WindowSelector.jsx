import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getTabs,
  getAllWindows,
  getCurrentWindow,
} from "~/scripts/browserActions";
import { updateSelectedWindow } from "../tabSlice";

const WindowSelector = () => {
  const dispatch = useDispatch();
  const [dropdownVisible, setDropDown] = useState(false);
  const [allWindows, setAllWindows] = useState([]);
  const [currentWindow, setCurrentWindow] = useState({});
  const { selectedWindow } = useSelector((state) => state.tabs);
  async function getWindows() {
    setAllWindows(await getAllWindows());
    setCurrentWindow(await getCurrentWindow());
  }
  useEffect(() => {
    getWindows();
  }, []);
  if (allWindows.length <= 1) return false;
  const setWindow = (window) => {
    dispatch(updateSelectedWindow(window));
    setDropDown(!dropdownVisible);
  };

  let totalTabCount = allWindows.reduce(function (total, window) {
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
        style={{ cursor: "pointer" }}
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
              onClick={() => setWindow("all")}
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
          {allWindows.map((window) => (
            <li
              className="list-group-item"
              onClick={() =>
                setWindow(
                  currentWindow.id === window.id ? "current" : window.id
                )
              }
              key={window.id}
            >
              <span
                className={`d-flex justify-content-between align-items-center btn-link`}
                onClick={() => {
                  // if (currentWindow.id !== window.id) return false;
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
              </span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};
export default WindowSelector;
