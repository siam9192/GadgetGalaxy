import Container from "@/components/container/Container";
import React from "react";
import { LayoutProps } from "../../../../.next/types/app/layout";

const layout = ({ children }: LayoutProps) => {
  return <Container>{children}</Container>;
};

export default layout;
