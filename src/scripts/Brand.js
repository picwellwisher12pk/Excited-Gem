import React from "react";

const Brand = (logo) => {
  return <div className="navbar-brand ">
    <a href="#" className="pull-left logo" style={{marginTop: '10px'}}>
      <img src={logo.default} alt="" style={{height: '40px', width: 'auto'}}/>
    </a>
  </div>
};
export default Brand;
