"use client";
import React from "react";

import SavingRadio from "./SavingRadio";
import SavingInput from "./SavingInput";
import SavingScreenShot from "./SavingScreenShot";

const Saving = () => {
  return (
    <div className='pt-3'>
      <SavingScreenShot />
      <SavingRadio />
      <SavingInput />
    </div>
  );
};

export default Saving;
