interface MenuItemProps {
  icon: React.ReactNode;
  name: string;
  time?: boolean;
  shortcut: string;
  setRecordVideo: (recordVideo: boolean) => void;
}

export function MenuItem({
  icon,
  name,
  time,
  shortcut,
  setRecordVideo,
}: MenuItemProps) {
  const handleRecordVideo = () => {
    if (name === "Record Video") setRecordVideo(true);
  };
  return (
    <div
      className='flex items-center justify-between py-[10px] px-3.5 group hover:bg-light cursor-pointer text-sm'
      onClick={handleRecordVideo}
    >
      <div className='flex items-center gap-2'>
        <span>{icon}</span>
        <h4>{name}</h4>
        {time && (
          <span className='ml-2 p-1 px-2 text-xs font-medium rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition duration-300'>
            3 Second
          </span>
        )}
      </div>
      <span className='text-[13px]'>{shortcut}</span>
    </div>
  );
}
