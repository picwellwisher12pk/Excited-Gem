import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";

const SliderBtn = ({
  icon,
  id,
  className,
}: {
  icon: React.ReactNode;
  id: string;
  className?: string;
}) => {
  return (
    <Button
      size='icon'
      className={cn(
        "bg-light flex items-center justify-center h-8 w-8 rounded-full hover:bg-secondary absolute top-[50%] z-50 translate-y-[-50%] border border-border cursor-pointer",
        className
      )}
      id={id}
    >
      {icon}
    </Button>
  );
};

export default SliderBtn;
