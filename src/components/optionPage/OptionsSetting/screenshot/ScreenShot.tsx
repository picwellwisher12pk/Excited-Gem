"use client";
import InputWithBtn from "@/components/InputWithBtn";
import React from "react";

const ScreenShot = () => {
  const renderInputWithLabel = (
    label: string,
    unit: string,
    val: number,
    des: string
  ) => (
    <div className='flex items-center justify-between border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727] mb-8'>
      <div>
        <h4 className='flex flex-col  pt-2'>{label}</h4>
        <p className='text-[#9A9A9A] mt-1 text-[13px] font-normal'>{des}</p>
      </div>
      <InputWithBtn
        unit={unit}
        val={val}
        className='max-w-[100px] ml-4'
        InputWidth=' max-w-[28px]'
      />
    </div>
  );
  return (
    <>
      {renderInputWithLabel(
        "Delayed screenshot time (secs)",
        "s",
        12,
        "Define the number of seconds to wait before capturing a screenshot. Useful for ensuring all content is fully loaded before taking the shot."
      )}
      {renderInputWithLabel(
        "Page scrolling delay time (ms)",
        "ms",
        12,
        "Set the delay (in milliseconds) between scroll steps while capturing full-page screenshots. Adjust this to avoid content loading issues during scrolling."
      )}
      {renderInputWithLabel(
        "Color depth filter (1 - disabled)",
        "px",
        12,
        "Adjust the depth of colors in the screenshot. A lower value reduces color quality for smaller file sizes. Set to '1' to disable filtering."
      )}
    </>
  );
};

export default ScreenShot;
