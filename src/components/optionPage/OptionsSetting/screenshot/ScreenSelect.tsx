import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ScreenSelect = ({
  trigger,
  items,
}: {
  trigger: string;
  items: string[];
}) => {
  return (
    <Select>
      <SelectTrigger className='w-auto flex gap-2 min-h-[50px] font-medium text-[15px]'>
        <SelectValue placeholder={trigger} />
      </SelectTrigger>
      <SelectContent className='font-medium'>
        {items.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ScreenSelect;
