import React from "react";
import CaptureSelect from "./CaptureSelect";
import OptionSelect from "../OptionSelect";
import ScreenShot from "@/components/optionPage/OptionsSetting/screenshot/ScreenShot";
const options = [
  { value: "always", label: "Always" },
  { value: "never", label: "Never" },
  { value: "only-full", label: "Only When Capturing Full Page" },
];
const Capture = () => {
  return (
    <>
      <ScreenShot />
      <CaptureSelect
        title='Skip Annotating'
        options={options}
        defaultValue='Always'
        des='Determine when annotation tools should be skipped, e.g., "Only When Capturing Full Page." Useful for quick captures without edits.'
      />

      <OptionSelect />
    </>
  );
};

export default Capture;
