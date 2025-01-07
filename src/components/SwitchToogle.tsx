import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
interface Props {
  title: string;
  para?: string;
  checked?: boolean;
  icon?: boolean;
  marginZero?: boolean;
  custom?: boolean;
}

const SwitchToggle = ({ title, para, checked, custom }: Props) => {
  return (
    <div
      className={cn(
        "border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727] mb-8",
        custom && "border-0 p-0 mt-4 mb-2 bg-transparent dark:bg-transparent "
      )}
    >
      <div className='flex items-center justify-between font-medium'>
        <div className='py-2'>
          <h4 className={cn("", custom && "text-sm")}>{title}</h4>
          {para && (
            <p className='text-[#9A9A9A] mt-1 text-[13px] font-normal'>
              {para}
            </p>
          )}
        </div>
        <div className='ml-4'>
          <Switch defaultChecked={checked} />
        </div>
      </div>
    </div>
  );
};

export default SwitchToggle;
