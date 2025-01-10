import { CardTitle } from "@/components/ui/card";
import Logo from "@/components/svgs/logo.svg?react";
import About from "@/components/svgs/About.svg?react";
import Rate from "@/components/svgs/Rate.svg?react";
import Setting from "@/components/svgs/Setting.svg?react";
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
        <Logo />
        WebShot
        <span className='py-1 px-2 bg-secondary rounded-md text-xs font-medium'>
          v1.0
        </span>
      </CardTitle>
      <div className='flex items-center gap-2'>
        {/* <Tooltip content={"light"} trigger={<ModeToggle />} /> */}
        <Tooltip content='About Us' trigger={<About />} />
        <Tooltip
          content='Rate Us'
          trigger={<Rate />}
          onClick={onRatingToggle}
          className={ratingOpen ? "bg-light" : ""}
        />
        <Tooltip
          content='Settings'
          trigger={
            <a href='/options/capture'>
              <Setting />
            </a>
          }
        />
      </div>
    </div>
  );
}
