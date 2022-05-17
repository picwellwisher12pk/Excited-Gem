import React from "react";

const Brand = (logo) => {
  console.log(logo);
  return (
    <div className="">
      <a href="#" style={{ marginTop: "10px" }}>
        <img src={logo} alt="" style={{ height: "40px", width: "auto" }} />
      </a>
    </div>
  );
};
export default Brand;
