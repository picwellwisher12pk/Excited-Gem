"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button, Group, Input } from "react-aria-components";
import { cn } from "@/lib/utils";

interface InputWithBtnProps {
  val: number;
  unit?: string;
  className?: string;
  InputWidth?: string;
  onChange?: (value: number) => void;
  increment?: () => void;
  decrement?: () => void;
}

export default function InputWithBtn({
  val,
  unit,
  className,
  InputWidth,
  onChange,
  increment,
  decrement,
}: InputWithBtnProps) {
  const [value, setValue] = useState<number>(val);

  useEffect(() => {
    setValue(val);
  }, [val]);

  const handleIncrement = () => {
    if (increment) {
      increment();
    } else {
      const newValue = value + 1;
      setValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (decrement) {
      decrement();
    } else {
      const newValue = value > 0 ? value - 1 : 0;
      setValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Remove any non-numeric characters
    const newValue = parseInt(inputValue, 10) || 0;
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div>
      <Group
        className={cn(
          "relative inline-flex h-[42px] items-center overflow-hidden whitespace-nowrap rounded-lg border dark:border-secondary  text-sm shadow-sm shadow-black/5 transition-shadow data-[disabled]:opacity-50 data-[focus-within]:outline-none w-[110px] justify-between",
          className
        )}
      >
        <div className='flex items-center'>
          <Input
            className={cn(
              " px-3 pr-0 py-2 text-foreground focus:outline-none w-[44px] max-w-max bg-transparent",
              InputWidth
            )}
            value={value.toString()}
            onChange={handleInputChange}
          />
          <span className='pl-1 text-muted-foreground'>{unit}</span>{" "}
        </div>
        <div className='flex h-[calc(100%+2px)] flex-col'>
          <Button
            onPress={handleIncrement}
            className='flex h-1/2 w-6 items-center justify-center dark:hover:bg-light border border-r-0 bg-bg dark:bg-select text-sm text-muted-foreground/80 transition-shadow hover:bg-light hover:text-foreground disabled:pointer-events-none disabled:opacity-50 focus:outline-none'
          >
            <ChevronUp size={12} strokeWidth={2} />
          </Button>
          <Button
            onPress={handleDecrement}
            className='flex h-1/2 w-6 items-center justify-center border border-r-0 border-t-0 bg-bg text-sm text-muted-foreground/80 transition-shadow hover:bg-light  dark:bg-select dark:hover:bg-light hover:text-foreground disabled:pointer-events-none disabled:opacity-50 focus:outline-none'
          >
            <ChevronDown size={12} strokeWidth={2} />
          </Button>
        </div>
      </Group>
    </div>
  );
}
