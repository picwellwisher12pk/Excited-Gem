"use client";

import React, { useState, useEffect } from "react";

export default function ProgressBar({
  text,
  onProgressComplete,
}: {
  text?: boolean;
  onProgressComplete?: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          if (onProgressComplete) {
            onProgressComplete();
          }
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onProgressComplete]);

  return (
    <>
      {!text ? (
        <div className='w-full  mx-auto mt-2'>
          <div className='relative pt-1'>
            <div className='flex mb-2 items-center justify-between'>
              <div>
                <span className='text-[15px] font-semibold inline-block  '>
                  Full Page Capturing...
                </span>
              </div>
              <div className='text-right'>
                <span className='text-sm font-semibold inline-block '>
                  {progress}%
                </span>
              </div>
            </div>
            <div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-secondary'>
              <div
                style={{ width: `${progress}%` }}
                className='shadow-none flex flex-col text-center whitespace-nowrap  justify-center bg-dark transition-all duration-500 ease-out'
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className='w-full  '>
          <div className='overflow-hidden h-1   flex  bg-secondary'>
            <div
              style={{ width: `${progress}%` }}
              className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#5cb85c] transition-all duration-500 ease-out'
            ></div>
          </div>
        </div>
      )}
    </>
  );
}
