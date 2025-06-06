import SettingSidebar from "@/components/sections/account/setting/SettingSidebar";
import React from "react";

interface IProps {
  children:React.ReactNode
}

const layout = ({ children }: IProps) => {
  return (
    <div>
      <h1 className="text-2xl font-medium">Account Settings</h1>
      <div className="grid md:grid-cols-7 grid-cols-1 gap-5 min-h-[90vh] py-5">
        <div className="md:col-span-2 ">
          <SettingSidebar />
        </div>
        <div className="md:col-span-5">{children}</div>
      </div>
    </div>
  );
};

export default layout;
