import Tooltip from "./Tooltip";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

interface Props {
  icon: React.ReactNode;
  text: string;
  content: string;
  setScreenShot: (screenShot: boolean) => void;
  recordVideo: boolean;
  setWebCam: Dispatch<SetStateAction<boolean>>;
  isSelected: boolean;
  onSelect: (text: string) => void;
}

const SmallCard = ({
  icon,
  text,
  content,
  setScreenShot,
  recordVideo,
  isSelected,
  onSelect,
}: Props) => {

  const handleClick = () => {
    onSelect(text);
    if (recordVideo && text === "Entire Page") {
      setScreenShot(true);
      setTimeout(() => {
        // router.push("/editor");
      }, 5000);
    }
  };

  return (
    <Tooltip content={content}>
      <div
        className={cn(
          "h-[90px] transition duration-300 w-[100px] rounded-xl flex items-center justify-center flex-col font-medium cursor-pointer text-[11px] gap-2 bg-secondary hover:bg-light active:border-2 active:border-dotted ",
          recordVideo && isSelected && "border-dotted border-2 border-border"
        )}
        onClick={handleClick}
      >
        {icon}
        <h4>{text}</h4>
      </div>
    </Tooltip>
  );
};

export default SmallCard;
