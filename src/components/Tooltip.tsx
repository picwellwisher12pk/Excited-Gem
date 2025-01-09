import React from "react";
import {
  Tooltip as TooltipBase,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";

interface TooltipProps {
  trigger?: React.ReactNode;
  content: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  contentClass?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  trigger,
  content,
  children,
  onClick,
  className,
  contentClass,
}) => (
  <TooltipProvider delayDuration={200}>
    <TooltipBase>
      <TooltipTrigger onClick={onClick}>
        {children ? (
          children
        ) : (
          <div
            className={cn(
              "flex items-center justify-center h-9 w-9 rounded-full hover:bg-light",
              className
            )}
          >
            {trigger}
          </div>
        )}
      </TooltipTrigger>
      <TooltipContent className={cn("bg-bg z-50", contentClass)}>
        {content}
      </TooltipContent>
    </TooltipBase>
  </TooltipProvider>
);

export default Tooltip;
