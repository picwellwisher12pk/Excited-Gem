import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Reset = () => {
  return (
    <div className='mt-8 border border-[#dadada] dark:border-[#4a4a4a] px-4 py-[12px] rounded-[12px] dark:bg-[#272727]'>
      <div className='flex items-center justify-between  font-medium '>
        <div className='py-2'>
          <h4>Reset to Default</h4>
          <p className='text-[#9A9A9A] mt-1 text-[13px] font-normal'>
            Revert all settings to their original default values, clearing any
            customizations and starting fresh.
          </p>
        </div>
        <div className='ml-4'>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                variant='outline'
                className='mt-2 flex items-center gap-2 rounded-full bg-[#f2f2f2] hover:bg-[#E5E5E5] dark:bg-[#3a3a3a] dark:hover:bg-[#535353]'
              >
                Reset Settings
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='p-0 rounded-2xl bg-card'>
              <AlertDialogHeader>
                <AlertDialogTitle className='border-b p-6 '>
                  Reset Extension Settings
                </AlertDialogTitle>
                <AlertDialogDescription className='py-3 px-6 text-[#9A9A9A]'>
                  Are you sure you want to reset all extension settings to their
                  default values? This action will erase any custom
                  configurations, and cannot be undone. Confirm to proceed with
                  resetting the settings.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className='pb-6 px-6 '>
                <AlertDialogCancel className='rounded-full  py-[8px] px-[20px]'>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction className='rounded-full hover:bg-[#B91C1C] bg-[#EF4444] text-white py-[8px] px-[20px]'>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default Reset;
