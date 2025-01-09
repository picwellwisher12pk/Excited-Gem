import React from "react";
import { Radio } from "../Radio";
const settings = [
  {
    title: "Download Screenshot As",
    options: [
      { value: "Capture", label: "Capture" },
      { value: "Record", label: "Record" },
      { value: "Last used", label: "Last used" },
    ],
    defaultValue: "Last used",
  },
];
const SettingRadio = () => {
  return (
    <div>
      {settings.map((setting) => (
        <Radio
          key={setting.title}
          title={setting.title}
          options={setting.options}
          defaultValue={setting.defaultValue}
        />
      ))}
    </div>
  );
};

export default SettingRadio;
