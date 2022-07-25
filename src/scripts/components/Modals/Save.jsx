import { Input } from "antd";
import { Radio, Modal, Select } from "antd";
const { Option } = Select;
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { clearSelectedTabs } from "../../tabSlice";
const children = [];
export const SaveModal = (props) => {
  const { tabs, filteredTabs } = useSelector((state) => state.tabs);
  console.log(props.selectedTabs);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [list, setList] = useState([]);
  const handleChange = (value) => {
    children.push(value);
    console.log(`selected ${value}`);
  };
  return (
    <Modal
      title={"Save Tabs as list"}
      visible={true}
      onOk={() => {
        props.setSaveModalVisible(false);
      }}
      onCancel={() => {
        props.setSaveModalVisible(false);
      }}
    >
      <Input
        className="mb-3"
        defaultValue={""}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <div className="mt-3">
        <span>Tags</span>
        <Select
          className="border"
          mode="tags"
          style={{
            width: "100%",
          }}
          placeholder="Tags Mode"
          onChange={handleChange}
        >
          {children}
        </Select>
      </div>
      <div className="mt-5">
        <span>Tabs</span>
        {props.selectedTabs.map((tabId) => {
          const tab = tabs.find((tab) => {
            return tab.id === tabId;
          });
          return (
            <div className="overflow-hidden tab-item flex p-2 bg-slate-100 hover:bg-slate-100 transition-colors duration-300 border-b-stone-100 border ">
              <strong>{tab.title}</strong>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
