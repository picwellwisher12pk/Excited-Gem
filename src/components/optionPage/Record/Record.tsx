import React from "react";
import Link from "next/link";
import InputWithBtn from "@/components/InputWithBtn";
import SwitchToggle from "@/components/SwitchToogle";
import CaptureSelect from "../capture/CaptureSelect";
import QualitySelect from "@/components/homePage/videoQuality/QualitySelect";
const option = [
  { value: "mp4", label: "MP4" },
  { value: "bm", label: "WEBM" },
];
const Record = () => {
  return (
    <>
      <SwitchToggle
        title='Allow reminder when Microphone is turned off.'
        para=' Enable this option to receive reminders if the microphone is turned off during recording. Helps avoid missing audio input unintentionally.'
      />
      <div className='border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727] mb-8'>
        <div className='flex items-center justify-between  '>
          <div className=' flex flex-col py-2'>
            <h4> Countdown Timer</h4>
            <p className='text-[#9AA0A6] text-[13px] mt-1'>
              Set the countdown duration (in seconds) before the recording
              begins. This allows preparation time before starting the recording
              process.
            </p>
          </div>
          <InputWithBtn
            unit='s'
            val={2}
            className='max-w-[75px] '
            InputWidth='max-w-[22px]'
          />
        </div>
      </div>
      <div className='flex items-center justify-between  border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727] mb-8'>
        <div className='py-2'>
          <h3>Recording shortcuts </h3>
          <p className='text-[#9AA0A6] mt-1 text-[13px]'>
            Manage and configure keyboard shortcuts for starting, pausing, and
            stopping recordings for efficient operation. (Recording
            Shortcuts) button
          </p>
        </div>
        <Link
          href='#'
          className='underline text-[15px] ml-4 hover:text-[#1890ff] transition duration-200'
        >
          Manage
        </Link>
      </div>
      <div className='flex items-center justify-between  border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727] mb-8'>
        <QualitySelect
          title='Video and Audio Quality'
          para='Adjust the quality of video and audio recordings. Choose from available options like high, medium, or low to balance quality and file size.
'
        />
      </div>

      <CaptureSelect
        options={option}
        title='Video Format'
        defaultValue='MP4'
        des='Select the file format for video recordings, such as MP4, AVI, or WEBM, depending on your requirements and compatibility.
'
      />
      <div className='flex items-center justify-between  border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727] mb-8'>
        <div className='flex items-center justify-between '>
          <div className='py-2'>
            <label>Countdown</label>
            <p className='text-[#9A9A9A] mt-1 text-[13px] font-normal'>
              Set a countdown timer before video recording starts, allowing
              preparation time. The timer can be customized in seconds.
            </p>
          </div>
          <InputWithBtn val={0} className='max-w-[75px]' />
        </div>
      </div>
      <SwitchToggle
        title='Click animation'
        para=' Enable visual click effects to highlight mouse clicks during video recording. This feature is useful for tutorials and presentations.'
        checked
      />
    </>
  );
};

export default Record;
