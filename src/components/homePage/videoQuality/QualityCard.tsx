import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import VideoQuality from "./VideoQuality";
interface Props {
  card: boolean;
  setCard: React.Dispatch<React.SetStateAction<boolean>>;
}
const QualityCard = ({ card, setCard }: Props) => {
  return (
    <div
      className={cn(
        "py-2 w-[388px] px-6 border-t-2 translate-y-full  opacity-0 border-dotted dark:border-white absolute left-0 bg-white bottom-0 transition-all duration-300 dark:bg-[#272727] hidden right-0 ",
        card && "translate-y-0 opacity-100 block "
      )}
      style={{ zIndex: "99999" }}
    >
      <VideoQuality />
      <span
        className='absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full hover:bg-[#c4c1c1] cursor-pointer dark:hover:bg-[#535353]  '
        onClick={() => setCard(false)}
      >
        <TooltipProvider delayDuration={1}>
          <Tooltip>
            <TooltipTrigger>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='28px'
                viewBox='0 -960 960 960'
                width='28px'
                fill='currentColor'
              >
                <path d='M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z' />
              </svg>
            </TooltipTrigger>
            <TooltipContent className='dark:bg-black bg-white text-dark'>
              <p>Close</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    </div>
  );
};

export default QualityCard;
