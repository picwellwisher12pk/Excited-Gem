"use client";
import Option from "./Option";
import Reset from "./Reset";

const SettingManage = () => {
  return (
    <div className='mb-6'>
      <h2 className='text-[18px] font-bold mt-8 mb-5 '>Settings Management</h2>
      <Option
        title='Import Settings'
        para=' Load and apply previously saved settings from a file, allowing you to quickly restore your preferred configuration.'
        btn='Import'
        marginZero={true}
      />
      <Option
        title='Export Settings'
        para='Save your current settings to a file, enabling easy backup or transfer to another device.'
        btn='Export'
      />
      <Reset />
    </div>
  );
};

export default SettingManage;
