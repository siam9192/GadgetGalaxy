"use client";
import React from "react";
import Container from "@/components/container/Container";
import { ILayoutProps } from "@/types/util.type";

const layout = ({ children }: ILayoutProps) => {
  return (
    <>
      <Container>{children}</Container>
    </>
  );
};

export default layout;
