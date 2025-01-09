import InputWithBtn from "@/components/InputWithBtn";
import CaptureSelect from "@/components/optionPage/capture/CaptureSelect";
import SwitchToggle from "@/components/SwitchToogle";
import React from "react";

import QualitySelect from "./QualitySelect";

const option = [
  { value: "mp4", label: "MP4" },
  { value: "bm", label: "WEBM" },
];

const VideoQuality = () => {
  return (
    <div>
      <h2 className='font-semibold py-1 pt-6 flex items-center gap-2'>
        Video Setting
      </h2>
      <QualitySelect title='Video and Audio Quality' />
      <CaptureSelect
        options={option}
        title='Video Format'
        defaultValue='MP4'
        custom
      />
      <div className='flex items-center justify-between '>
        <label className='text-sm'>Countdown</label>
        <InputWithBtn val={0} className='max-w-[75px]' />
      </div>
      <SwitchToggle title='Click animation' custom checked />
    </div>
  );
};

export default VideoQuality;
