"use client";

import { useState } from "react";
import RatingHead from "./RatingHead";
import Thanks from "./Thanks";
import { useRouter } from "next/navigation";
import RateBtns from "./RateBtns";
import RateIcons from "./RateIcons";
interface Props {
  setRatingOpen: (value: boolean) => void;
}
export default function Rating({ setRatingOpen }: Props) {
  const [rating, setRating] = useState(0);
  const [showThanks, setShowThanks] = useState(false);
  const [ratingSelected, setRatingSelected] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (rating >= 4) {
      router.push(
        "https://chromewebstore.google.com/detail/better-history/egehpkpgpgooebopjihjmnpejnjafefi?hl=en"
      );
    } else {
      setShowThanks(true);
    }
  };

  return (
    <div>
      {showThanks ? (
        <Thanks
          setShowThanks={setShowThanks}
          setRating={setRating}
          setRatingOpen={setRatingOpen}
        />
      ) : (
        <div className='w-full  flex items-center justify-center gap-4 flex-col py-8 px-3'>
          <RatingHead />
          <div className='flex flex-col items-center gap-4'>
            <RateIcons
              ratingSelected={ratingSelected}
              rating={rating}
              setRating={setRating}
              setRatingSelected={setRatingSelected}
            />
            <RateBtns
              handleSubmit={handleSubmit}
              setRatingOpen={setRatingOpen}
              ratingSelected={ratingSelected}
            />
          </div>
        </div>
      )}
    </div>
  );
}
