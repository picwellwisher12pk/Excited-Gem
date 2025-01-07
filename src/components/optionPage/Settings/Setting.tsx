import React from "react";
import SwitchToggle from "@/components/SwitchToogle";
import { settings } from "@/constant/screenShotSettingData";
import SettingManage from "./settingManagement/SettingManage";

const Setting = () => {
  return (
    <>
      <SwitchToggle
        title="Turn on dark mode for the extension's popup menu"
        para='Switch to dark mode for a more comfortable experience in low-light settings.
'
      />
      {settings.slice(6).map((option, id) => (
        <SwitchToggle key={id} title={option.name} para={option.des} checked />
      ))}
      <SettingManage />
    </>
  );
};

export default Setting;
