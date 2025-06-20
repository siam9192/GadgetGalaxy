import React from "react";

import AccountSidebar from "@/components/ui/AccountSidebar";
import Container from "@/components/container/Container";
import ResponsiveAccountSidebar from "@/components/ui/ResponsiveAccountSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  description: "Gadget galaxy checkout page!",
};
interface IProps {
  children: React.ReactNode;
}

const layout = ({ children }: IProps) => {
  return (
    <Container>
      <div className="lg:grid grid-cols-7 gap-5 min-h-[90vh] py-5">
        <div className="col-span-2 lg:block hidden">
          <AccountSidebar />
        </div>
        <div className="col-span-5">
          <ResponsiveAccountSidebar />
          {children}
        </div>
      </div>
    </Container>
  );
};

export default layout;
