"use client";
import { settings } from "@/constant/screenShotSettingData";
import SwitchToggle from "../SwitchToogle";

export default function OptionSelect() {
  return (
    <div className='pb-3 pt-0'>
      {settings.slice(3, 6).map((option, id) => (
        <SwitchToggle key={id} title={option.name} para={option.des} checked />
      ))}
    </div>
  );
}
