import Container from "@/components/container/Container";
import React from "react";

interface IProps {
  children: React.ReactNode;
}
const layout = ({ children }: IProps) => {
  return (
    <div className="min-h-screen">
      <Container>{children}</Container>
    </div>
  );
};

export default layout;
