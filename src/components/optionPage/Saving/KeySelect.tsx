import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { options } from "@/constant/SelectKeysData";
const KeySelect = ({ option }: { option: { id: number; name: string } }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([
    "1",
    "A",
    "Z",
  ]);

  const handleSelectChange = (value: string, index: number) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = value;
    setSelectedValues(newSelectedValues);
  };

  const isOptionDisabled = (value: string, currentIndex: number) => {
    return selectedValues.some(
      (selectedValue, index) =>
        selectedValue === value && index !== currentIndex
    );
  };
  return (
    <div className='flex items-center gap-1'>
      <span className='text-[15px]'>Ctrl + Shift +</span>
      <Select
        value={selectedValues[option.id]}
        onValueChange={(value) => handleSelectChange(value, option.id)}
      >
        <SelectTrigger className='w-16 h-8'>
          <SelectValue placeholder={option.id + 1} />
        </SelectTrigger>
        <SelectContent className='max-h-[300px]'>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={isOptionDisabled(opt.value, option.id)}
            >
              {opt.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default KeySelect;
