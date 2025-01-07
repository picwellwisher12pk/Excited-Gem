import React from "react";
import { CardDescription, CardTitle } from "../ui/card";
import { Star } from "../svgs";

const RatingHead = () => {
  return (
    <div>
      <div className='flex flex-col items-center  justify-center'>
        <span className='bg-[#d2b204]  text-white mb-2 h-12 w-12 flex items-center justify-center rounded-full'>
          <Star />
        </span>
        <CardTitle
          className=' text-2xl font-medium '
          style={{ marginBottom: "6px" }}
        >
          How did we do?
        </CardTitle>

        <CardDescription
          className='text-center text-[#888]'
          style={{ marginBottom: "4px" }}
        >
          Please let us know how we did with your support request. All feedback
          is appreciated to help us improve our offering!
        </CardDescription>
      </div>
    </div>
  );
};

export default RatingHead;
