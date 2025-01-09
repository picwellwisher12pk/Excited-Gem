"use client";
import { X } from "lucide-react";
import React from "react";
import { Alert as AlertBase, AlertDescription } from "@/components/ui/alert";
import { BsInfo } from "react-icons/bs";
interface Props {
  handleClose: () => void;
}
const Alert = ({ handleClose }: Props) => {
  return (
    <div className='pt-6 '>
      <AlertBase className='bg-alert  relative  dark:border-none '>
        <AlertDescription className='flex gap-3 text-[13px]'>
          <span className='h-6 w-6 flex items-center flex-shrink-0 justify-center bg-alert-icon rounded-full'>
            <BsInfo size={20} />
          </span>
          Screenshot upload server is temporarily <br /> down for maintenance.
          We&apos;ll be back shortly!
        </AlertDescription>
        <span className='absolute top-2 right-2' onClick={handleClose}>
          <X
            size={16}
            className='text-[#999] hover:text-black dark:hover:text-[#f4f4f4] cursor-pointer'
          />
        </span>
      </AlertBase>
    </div>
  );
};

export default Alert;
