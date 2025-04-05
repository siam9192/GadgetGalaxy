import React from "react";
import { LayoutProps } from "../../../../../.next/types/app/layout";
import Container from "@/components/container/Container";

const layout = ({ children }: LayoutProps) => {
  return <Container>{children}</Container>;
};

export default layout;
