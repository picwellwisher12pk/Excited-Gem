import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { options } from "@/constant/option";
import { options as option } from "@/constant/ScreenShotOptions";
import React, { useState } from "react";
import ScreenSelect from "./screenshot/ScreenSelect";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
const opt2 = ["Edit", "Open uploading window", "Download"];
const ActionMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='flex items-center justify-between border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727] mb-8'>
        <div className='grid grid-cols-1 '>
          {options.map((item, i) => (
            <div key={i} className='flex items-center gap-2 py-3'>
              <Checkbox
                className='rounded-full h-5 w-5'
                defaultChecked
                value={item.name}
                id={item.name}
              />
              <Label htmlFor={item.name} className='flex items-center gap-2'>
                <span>{item.icon}</span>
                <h4>{item.name}</h4>
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div className='border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727]'>
        <div className='flex items-center justify-between font-medium'>
          <div className='py-2'>
            <h4>Enable Quick Screenshot (Without Opening the Menu)</h4>
            <p className='text-[#9A9A9A] mt-1 text-[13px] font-normal'>
              Turn on this option to take a screenshot instantly by clicking the
              extension icon, bypassing the settings menu for faster operation.
            </p>
          </div>
          <div className='ml-4'>
            <Switch checked={open} onClick={() => setOpen(!open)} />
          </div>
        </div>
        <div
          className={cn(
            "transition-all duration-500 overflow-hidden max-h-0 opacity-0",
            open && "max-h-[500px] opacity-100"
          )}
        >
          <div className='text-sm italic pt-3'>
            <span className='flex items-center gap-2'>
              After clicking on the iconmake a screenshot{" "}
              <ScreenSelect trigger='Visible part of page ' items={option} />
            </span>
            <span className='flex items-center gap-2'>
              and then
              <ScreenSelect trigger='Edit ' items={opt2} />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActionMenu;
