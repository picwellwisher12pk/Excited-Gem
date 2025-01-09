"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
interface Props {
  title: string;
  para?: string;
}
const QualitySelect = ({ title, para }: Props) => {
  const qualityOptions = [
    { value: "2160p", label: "2160p", badge: "4K" },
    { value: "1440p", label: "1440p", badge: "2K" },
    { value: "1080p", label: "1080p", badge: "HD" },
    { value: "720p", label: "720p", badge: "HD" },
  ];
  const [selectedQuality, setSelectedQuality] = useState<string>(
    qualityOptions[1].value
  );
  return (
    <>
      <div
        className={cn(
          "font-medium flex items-center justify-between mt-4 ",
          para && "mt-0"
        )}
      >
        <div className={cn("pt-2", para && "py-2")}>
          <h4 className={cn("text-sm", para && "text-base")}>{title}</h4>
          {para && (
            <p className='text-[#9A9A9A] mt-1 text-[13px] font-normal'>
              {para}
            </p>
          )}
        </div>
        <div className=' ml-4'>
          <Select value={selectedQuality} onValueChange={setSelectedQuality}>
            <SelectTrigger className='w-[120px] h-[44px]'>
              <SelectValue placeholder='Select video quality' />
            </SelectTrigger>
            <SelectContent className='max-h-[190px]' style={{ zIndex: 999999 }}>
              {qualityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className='grid grid-cols-2 w-full'>
                    <span>{option.label}</span>
                    <Badge className='rounded text-[10.4px] h-[18px] w-[20px] bg-dark text-card ml-2.5 mr-2 py-0 font-semibold flex items-center justify-center'>
                      {option.badge}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default QualitySelect;
