"use client";
import React, { ReactNode } from "react";

const RecentViewContainer = ({ children }: { children: ReactNode }) => {
  const raw = sessionStorage.getItem("recent-view");
  const stored: number[] = raw ? JSON.parse(raw) : [];
  return children;
};

export default RecentViewContainer;
