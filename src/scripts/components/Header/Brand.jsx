import React from "react";

const Brand = (logo) => {
  console.log(logo);
  return (
    <div className="navbar-brand ">
      <a href="#" className="pull-left logo" style={{ marginTop: "10px" }}>
        <img src={logo} alt="" style={{ height: "40px", width: "auto" }} />
      </a>
    </div>
  );
};
export default Brand;
