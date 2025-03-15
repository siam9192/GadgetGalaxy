import BottomMenu from "@/components/shared/BottomMenu";
import Footer from "@/components/shared/Footer";
import Header1 from "@/components/shared/Header1";
import React from "react";
import { LayoutProps } from "../../../.next/types/app/layout";

const layout = ({ children }: LayoutProps) => {
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
