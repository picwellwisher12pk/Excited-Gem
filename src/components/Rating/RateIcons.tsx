import React, { useState } from "react";
import { RoundedStar } from "../svgs";
import { cn } from "@/lib/utils";
interface Props {
  ratingSelected: boolean;
  rating: number;
  setRating: (rating: number) => void;
  setRatingSelected: (ratingSelected: boolean) => void;
}
const RateIcons = ({
  ratingSelected,
  rating,
  setRating,
  setRatingSelected,
}: Props) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStar = (star: number) => {
    if (!ratingSelected) {
      setRating(star);
      setRatingSelected(true);
    }
  };

  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={cn(
            "p-2 rounded-full transition-colors bg-secondary hover:bg-black  ",
            star <= (hoverRating || rating) && "bg-black text-white",
            ratingSelected ? "cursor-default" : ""
          )}
          onClick={() => handleStar(star)}
          onMouseEnter={() => !ratingSelected && setHoverRating(star)}
          onMouseLeave={() => !ratingSelected && setHoverRating(0)}
        >
          <RoundedStar />
        </button>
      ))}
    </div>
  );
};

export default RateIcons;
