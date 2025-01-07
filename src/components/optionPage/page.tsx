"use client";
import { Sidebar } from "@/components/optionPage/Sidebar";
import OptionPageCard from "@/components/optionPage/OptionPageCard";
import Record2 from "@/components/optionPage/Record/Record";
import React from "react";

const page = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <div>
        <OptionPageCard
          custom
          tabs
          logo
          title='Recording Settings'
          para='Set preferences for screen recording and video capture.'
        >
          <Record2 />
        </OptionPageCard>
      </div>
    </div>
  );
};

export default page;
