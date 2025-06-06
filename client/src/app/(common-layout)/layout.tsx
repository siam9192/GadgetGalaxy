import BottomMenu from "@/components/shared/BottomMenu";
import Footer from "@/components/shared/Footer";
import Header1 from "@/components/shared/Header1";
import React from "react";

interface IProps {
  children:React.ReactNode
}
const layout = ({ children }: IProps) => {
  return (
    <>
      <Header1 />
      {children}
      <Footer />
      <BottomMenu />
    </>
  );
};

export default layout;
