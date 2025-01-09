"use client";

import { CardTitle } from "@/components/ui/card";
// import { Logo, About, Rate, Setting } from "@/components/svgs";
import logoUrl from "@/components/svgs/Logo.svg?url";
import Tooltip from "@/components/Tooltip";
// import ModeToggle from "@/components/ModeToggle";
interface CardProps {
  onRatingToggle: () => void;
  ratingOpen: boolean;
}

export function CardHeader({ onRatingToggle, ratingOpen }: CardProps) {

  return (
    <div className='border-b border-light py-3 px-4 flex items-center justify-between'>
      <CardTitle className='text-[15px] font-semibold flex items-center gap-2'>
        {logoUrl}
        WebShot
        <span className='py-1 px-2 bg-secondary rounded-md text-xs font-medium'>
          v1.0
        </span>
      </CardTitle>
      <div className='flex items-center gap-2'>
        {/* <Tooltip content={mode} trigger={<ModeToggle />} /> */}
        <Tooltip content='About Us' trigger={logoUrl} />
        <Tooltip
          content='Rate Us'
          trigger={logoUrl}
          onClick={onRatingToggle}
          className={ratingOpen ? "bg-light" : ""}
        />
        <Tooltip
          content='Settings'
          trigger={
            <a href='/options/capture'>
              {logoUrl}
            </a>
          }
        />
      </div>
    </div>
  );
}
