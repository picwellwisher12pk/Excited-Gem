import { Badge, Select } from "antd";
const { Option } = Select;
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { updateSelectedWindow } from "../tabSlice";

export default function WindowSelector({ allWindows, currentWindow }) {
  const dispatch = useDispatch();
  const [dropdownVisible, setDropDown] = useState(false);
  const { selectedWindow } = useSelector((state) => state.tabs);

  const setWindow = (window) => {
    dispatch(updateSelectedWindow(window));
    setDropDown(!dropdownVisible);
  };

  let totalTabCount = allWindows.reduce(function (total, window) {
    return total + window.tabs.length;
  }, 0);
  return (
    <Select
      style={{ width: 200 }}
      defaultValue={currentWindow.id}
      className="!border-0 shadow-md !rounded-[2px] !bg-gradient-to-b !from-white !to-slate-200"
    >
      <Option className="list-group-item" value="all">
        <div className="flex justify-between">
          <div>
            <span
              className={
                "inline-block w-2 h-2 rounded-full mb-[1px] mr-2 " +
                (currentWindow.id === window.id && "bg-green-500")
              }
            ></span>
            <span>All Windows</span>
          </div>
          <small
            className={
              totalTabCount > 50 ? "!text-orange-600" : "!text-lime-700"
            }
          >
            {totalTabCount} tab(s)
          </small>
        </div>
      </Option>
      {allWindows.map((window) => (
        <Option
          className="list-group-item"
          value={window.id}
          onClick={() =>
            setWindow(currentWindow.id === window.id ? "current" : window.id)
          }
          key={window.id}
        >
          <span
            className={`flex justify-between align-items-center btn-link`}
            onClick={() => {
              setWindow(window.id);
            }}
          >
            <div>
              <span
                className={
                  "inline-block w-2 h-2 rounded-full mb-[1px] mr-2 " +
                  (currentWindow.id === window.id && "bg-green-500")
                }
              ></span>
              <span>
                Window
                {currentWindow.id === window.id && (
                  <small className="text-gray-400"> (current)</small>
                )}
                <span className="sr-only">(current)</span>
              </span>
            </div>
            <small
              className={
                window.tabs.length > 50 ? "!text-orange-600" : "!text-lime-700"
              }
            >
              {window.tabs.length} tab(s)
            </small>
          </span>
        </Option>
      ))}
    </Select>
  );
}
