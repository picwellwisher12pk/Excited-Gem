import { Segmented } from "antd";
import { Radio, Button, Modal } from "antd";
import React, { useState } from "react";
import Browser, { browserSettings } from "webextension-polyfill";

export const MoveModal = (props) => {
  const options = ["Current Windows", "New Window", "To End", "To Start"];
  const [type, setType] = useState(options[0]);
  const [windowId, setWindowId] = useState(props.currentWindow.id);
  const [position, setPosition] = useState(0);
  function resetComponent() {
    setType(options[0]);
    setWindowId(props.currentWindow.id);
    setPosition(0);
  }
  function makeMoveTypeUI(type) {
    switch (type) {
      case "Current Windows":
        return (
          <Radio.Group onChange={({ target }) => setWindowId(target.value)}>
            <div className="flex flex-col">
              {props.windows.map((window, i) => (
                <Radio
                  value={window.id}
                  disabled={window.id === props.currentWindow.id && true}
                >
                  {window.id === props.currentWindow.id && "Current"} Window
                  {i + 1}{" "}
                  <small className="text-orange-500">
                    ({window.tabs.length} tabs)
                  </small>
                  <small className="text-gray-300 ml-3">ID:{window.id}</small>
                </Radio>
              ))}
            </div>
          </Radio.Group>
        );
      case "New Window":
        return (
          <>
            <p>This will move your selected tabs to new window.</p>
            <strong className="text-cyan-500">Hit OK to continue!</strong>
          </>
        );
      case "To End":
        return (
          <>
            <p>This will move your selected tabs to end of current window.</p>
            <strong className="text-cyan-500">Hit OK to continue!</strong>
          </>
        );
      case "To Start":
        return (
          <>
            <p>This will move your selected tabs to start of current window.</p>
            <strong className="text-cyan-500">Hit OK to continue!</strong>
          </>
        );
    }
  }
  return (
    <Modal
      title={`Move (${props.selectedTabs.length}) Tabs to`}
      visible={true}
      onOk={() => {
        switch (type) {
          case "Current Windows":
            if (windowId === props.currentWindow.id) {
              alert("Select some window to move to");
              return false;
            }
            Browser.tabs
              .move(props.selectedTabs, {
                windowId: windowId || props.currentWindow.id,
                index: position,
              })
              .then(() => {
                resetComponent();
                props.setMoveModalVisible(false);
              });
            return;

          case "New Window":
            Browser.windows.create().then((window) => {
              Browser.tabs
                .move(props.selectedTabs, { windowId: window.id, index: 0 })
                .then(() => {
                  resetComponent();
                  props.setMoveModalVisible(false);
                });
            });
            return;
          case "To End":
            Browser.tabs
              .move(props.selectedTabs, {
                windowId: props.currentWindow.id,
                index: -1,
              })
              .then(() => {
                resetComponent();
                props.setMoveModalVisible(false);
              });
            return;

          case "To Start":
            Browser.tabs
              .move(props.selectedTabs, {
                windowId: props.currentWindow.id,
                index: 0,
              })
              .then(() => {
                resetComponent();
                props.setMoveModalVisible(false);
              });
            return;
        }
      }}
      onCancel={() => {
        props.setMoveModalVisible(false);
      }}
    >
      <Segmented options={options} onChange={setType} />
      <div className="py-3">{makeMoveTypeUI(type)}</div>
    </Modal>
  );
};
