import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";

interface Props {
  ratingSelected: boolean;
  handleSubmit: () => void;
  setRatingOpen: (isOpen: boolean) => void;
}
const RateBtns = ({ ratingSelected, handleSubmit, setRatingOpen }: Props) => {
  return (
    <>
      <Button
        variant='outline'
        className={cn(
          "font-bold bg-secondary text-dark border  h-[48px] w-full rounded-[30px] tracking-[1px] text-[15px] mt-4",
          ratingSelected && "bg-black  text-white hover:bg-[#2a2a2a] border"
        )}
        onClick={handleSubmit}
      >
        Submit
      </Button>
      <Button
        variant='link'
        className='font-normal text-[#999] border-none'
        size='sm'
        onClick={() => setRatingOpen(false)}
      >
        No, Thanks!
      </Button>
    </>
  );
};

export default RateBtns;
