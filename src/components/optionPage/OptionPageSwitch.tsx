import React from "react";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

const OptionPageSwitch = ({
  label,
  icon,
  className,
  checked,
}: {
  label: string;
  className?: string;
  checked?: boolean;
  icon?: React.ReactNode;
}) => {
  return (
    <div className={cn("flex items-center justify-between py-3", className)}>
      <div className='flex items-center pr-3'>
        <span className='text-[15px] flex items-center gap-2'>
          {icon && icon}
          {label}
        </span>
      </div>
      <Switch id='switch-01' checked={checked} />
    </div>
  );
};

export default OptionPageSwitch;
