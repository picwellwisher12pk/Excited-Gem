import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
interface Props {
  title: string;
  para: string;
  btn: string;
  marginZero?: boolean;
}
const Option = ({ title, para, btn, marginZero = false }: Props) => {
  const [loading, setLoading] = useState(false);
  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  return (
    <div
      className={` ${
        marginZero ? "mt-0" : "mt-8"
      } border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727]`}
    >
      <div className='flex items-center justify-between  font-medium '>
        <div className='py-2'>
          <h4>{title}</h4>
          <p className='text-[#9A9A9A] mt-1 text-[13px] font-normal'>{para}</p>
        </div>
        <div className='ml-4'>
          <Button
            variant='outline'
            className='mt-2 flex items-center gap-2 rounded-full bg-[#f2f2f2] hover:bg-[#E5E5E5] dark:bg-[#3a3a3a] dark:hover:bg-[#535353]'
            onClick={handleLoading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className=' animate-spin' />
                {btn}
              </>
            ) : (
              <>{btn}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Option;
