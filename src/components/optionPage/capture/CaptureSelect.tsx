import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";
interface Props {
  title: string;
  options: { value: string; label: string }[];
  defaultValue: string;
  des?: string;
  custom?: boolean;
}
const CaptureSelect = ({
  title,
  options,
  defaultValue,
  des,
  custom,
}: Props) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727] mb-8",
        custom && "border-0 p-0 mt-4 mb-4 bg-transparent dark:bg-transparent "
      )}
    >
      <div>
        <h4 className={cn("pt-2", custom && "text-sm")}>{title}</h4>
        <p className='text-[#9A9A9A] mt-1 text-[13px] font-normal'>{des}</p>
      </div>

      <div className='ml-4'>
        <Select>
          <SelectTrigger
            defaultValue={options[0].label}
            className='w-auto h-10 flex gap-3 whitespace-nowrap '
          >
            <SelectValue placeholder={defaultValue} />
          </SelectTrigger>
          <SelectContent
            className={cn("max-h-[300px]", custom && "w-[10px] right-[45px]")}
            style={{ zIndex: 999999 }}
          >
            {options.map((option, i) => (
              <SelectItem key={i} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CaptureSelect;
