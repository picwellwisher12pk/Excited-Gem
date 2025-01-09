"use client";
import { Button } from "../ui/button";
interface Props {
  setShowThanks: (value: boolean) => void;
  setRatingOpen: (value: boolean) => void;
  setRating: (value: number) => void;
}
export default function Thanks({
  setShowThanks,
  setRating,
  setRatingOpen,
}: Props) {
  const handleBtn = () => {
    setShowThanks(false);
    setRating(0);
    setRatingOpen(false);
  };

  return (
    <div className='w-full max-w-md'>
      <div className='flex flex-col items-center justify-center gap-4 p-6'>
        <h2 className='text-2xl font-semibold'>Thank you!</h2>
        <p className='text-[#888] text-sm text-center'>
          We appreciate you taking the time to give a rating. If you ever need
          more support, don’t hesitate to get in touch!
        </p>
        <Button
          onClick={handleBtn}
          variant='outline'
          className='font-bold h-[48px] w-full rounded-[30px] tracking-[1px] bg-secondary text-[15px] hover:bg-black hover:text-white mt-4 border-none'
        >
          Done
        </Button>
      </div>
    </div>
  );
}
