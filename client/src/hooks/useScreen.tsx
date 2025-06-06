"use client";
import { useEffect, useState } from "react";

type TScreenType = "lg" | "md" | "sm";

const useScreen = () => {
  const [screenType, setScreenType] = useState<TScreenType>("lg");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const updateShowLength = () => {
      const innerWidth = window.innerWidth;
      if (innerWidth > 768) {
        setScreenType("lg");
      } else if (innerWidth < 768 && innerWidth > 640) {
        setScreenType("md");
      } else setScreenType("sm");
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    updateShowLength();
    window.addEventListener("resize", updateShowLength);
    return () => window.removeEventListener("resize", updateShowLength);
  }, []);
  return {
    screenType,
    width,
    height,
  };
};

export default useScreen;
