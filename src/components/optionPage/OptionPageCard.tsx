import React from "react";
import { cn } from "@/lib/utils";

const OptionPageCard = ({
  children,
  title,
  para,
  custom,
}: {
  children?: React.ReactNode;
  tabs?: boolean;
  logo?: boolean;
  title?: string;
  para?: string;
  custom?: boolean;
}) => {
  return (
    <div className=' pt-[48px] px-[6rem] mb-2 '>
      <div className='mb-8'>
        <h1 className='font-bold text-[28px] '>{title}</h1>
        <p className='text-base text-[#777]'>{para}</p>
      </div>
      <div className=' flex flex-grow flex-col max-w-[640px] w-[640px] '>
        <div
          className={cn(
            "",
            !custom &&
              "border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727]"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default OptionPageCard;
