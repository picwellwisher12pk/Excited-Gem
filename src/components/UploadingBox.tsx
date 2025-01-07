import React from "react";
import ProgressBar from "./ProgressBar";

const UploadingBox = () => {
  return (
    <div className='px-6'>
      <h2 className='text-sm font-semibold text-left mt-1'>Image Uploading</h2>
      <ProgressBar />
      <p className='text-left text-xs font-medium'>
        Please do not scroll or move your mouse pointer while capturing in order
        to get the best result.
        <br />
        <br />
        For very long pages or infinite scroll pages, you can end the capturing
        manually by clicking &nbsp;
        <a href='#' className='underline'>
          Stop.
        </a>
      </p>
    </div>
  );
};

export default UploadingBox;
