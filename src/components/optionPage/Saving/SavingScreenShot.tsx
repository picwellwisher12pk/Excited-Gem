import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
const btns: string[] = [
  "Domain",
  "URL",
  "Title",
  "Date",
  "Time",
  "Timestamp",
  "Ms",
];

const SavingScreenShot: React.FC = () => {
  const [tags, setTags] = useState<string[]>(["Screenshot"]);

  const handleButtonClick = (item: string) => {
    if (!tags.includes(item)) {
      setTags([...tags, item]);
    }
  };

  return (
    <div className='mb-8 border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727]'>
      <div className='font-medium py-2'>
        <h4>File Name Pattern Screenshot</h4>
        <p className='text-[#9AA0A6] text-[13px] mt-1'>
          Define how your screenshot files are named by using placeholders like
          &quot;Domain,&quit; &quot;URL,&quot; &quot;Title,&quot;
          &quot;Date,&quot; &quot;Time,&quot; and more. This helps keep your
          files organized with meaningful names.
        </p>
      </div>
      <div className='mt-2'>
        <div className='flex flex-wrap gap-2.5 border border-input bg-background dark:bg-[#3a3a3a] px-3 py-2 text-sm min-h-[52px]  rounded-md'>
          {tags.map((tag, index) => (
            <div
              key={index}
              className='bg-[#f2f2f2] text-black dark:bg-[#535353] dark:text-white font-medium px-3 text-sm py-2 rounded-full flex items-center '
            >
              {tag}
              {tag !== "Screenshot" && (
                <button
                  className='ml-2 text-xs'
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className='flex items-center gap-4 '>
          {btns.map((item) => (
            <Button
              key={item}
              variant='outline'
              className={cn(
                "mt-4 text-sm cursor-pointer hover:bg-[#f2f2f2] dark:hover:bg-[#535353] px-4 text-[15px] border w-fit h-[44px] rounded-lg dark:border-[#383838] border-[#dadada] bg-transparent disabled:opacity-50",
                tags.includes(item) && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleButtonClick(item)}
              disabled={tags.includes(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavingScreenShot;
