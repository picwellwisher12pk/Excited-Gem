import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
interface Option {
  value: string;
  label: string;
}

interface Props {
  title: string;
  options: Option[];
  defaultValue: string;
  onChange?: (value: string) => void;
  para?: string;
}

export function Radio({ title, options, defaultValue, para }: Props) {
  return (
    <div className='py-3 flex items-center justify-between'>
      <div>
        <legend className='font-medium'>{title}</legend>
        <p className='text-[#9AA0A6] text-[13px] mt-1'>{para}</p>
      </div>
      <RadioGroup className='flex  ml-4 gap-4' defaultValue={defaultValue}>
        {options.map((item, id) => (
          <div
            key={id}
            className='flex items-center gap-[10px] text-sm cursor-pointer hover:bg-[#f2f2f2] dark:hover:bg-[#535353] px-4 text-[15px] border w-fit h-[44px] rounded-lg dark:border-[#383838] border-[#dadada] relative'
          >
            <div className='flex items-center gap-2'>
              <RadioGroupItem
                id={item.label}
                value={item.value}
                className='after:absolute after:inset-0'
              />
              <Label htmlFor={item.label}>{item.label}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
