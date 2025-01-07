import OptionPageSwitch from "@/components/optionPage/OptionPageSwitch";
import { RecordingBtn, StarRecording } from "@/components/svgs";
import { Button } from "@/components/ui/button";
import { setting } from "@/constant/RecordSetting";
import React from "react";
import { AiOutlineAudio } from "react-icons/ai";
import { GoArrowLeft } from "react-icons/go";
interface Props {
  setRecord: (record: boolean) => void;
  webCam: boolean;
  setVideoQualityPage: (isOpen: boolean) => void;
}
const RecordVideo = ({ setRecord, webCam, setVideoQualityPage }: Props) => {
  return (
    <div>
      <div className='border-t pt-2'>
        <h2 className='font-semibold py-1 flex items-center gap-2'>
          <span
            onClick={() => setRecord(false)}
            className='cursor-pointer opacity-50 hover:opacity-100'
          >
            <GoArrowLeft size={22} />
          </span>
          Record Video
        </h2>
        {webCam ? (
          <OptionPageSwitch
            label='Record Mic Sound'
            icon={<AiOutlineAudio size={22} />}
          />
        ) : (
          setting.map((item, i) => (
            <OptionPageSwitch key={i} label={item.feature} icon={item.icon} />
          ))
        )}
        <div className='flex items-center  gap-2 mt-4'>
          <Button className='bg-dark text-card flex-1 hover:bg-black/90 h-[42px] text-[15px] dark:hover:bg-white/90'>
            <StarRecording />
            Start Recording
          </Button>
          <Button
            className='bg-dark text-card hover:bg-black/90 dark:hover:bg-white/90 h-[42px] text-[15px] '
            onClick={() => {
              setVideoQualityPage(true);
            }}
          >
            <RecordingBtn />
            Setting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordVideo;
