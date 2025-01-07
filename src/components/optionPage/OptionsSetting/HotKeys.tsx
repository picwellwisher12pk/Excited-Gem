"use client";
import React from "react";
import { optionsKey } from "@/constant/ScreenShotKey";
import { EditPage } from "@/components/svgs";
import { Label } from "@/components/ui/label";
import KeySelect from "../Saving/KeySelect";

const HotKeys = () => {
  return (
    <>
      {optionsKey.map((item) => (
        <div key={item.id} className=' flex items-center justify-between '>
          <Label htmlFor={item.name} className='text-[15px] py-3'>
            {item.name}
          </Label>
          {item.selected === true ? (
            <KeySelect option={item} />
          ) : (
            <span className='text-[15px] flex items-center gap-1 '>
              Ctrl + Shift + 7{" "}
              <a href='#' className='w-[52px]'>
                <EditPage />
              </a>
            </span>
          )}
        </div>
      ))}
    </>
  );
};

export default HotKeys;
