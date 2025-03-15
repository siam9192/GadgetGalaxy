import React, { useEffect, useRef, useState } from "react";
import "@/styles/rangeSlider.css";

const RangeSlider: React.FC = () => {
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);
  const thumbMinRef = useRef<HTMLDivElement | null>(null);
  const thumbMaxRef = useRef<HTMLDivElement | null>(null);
  const rangeRef = useRef<HTMLDivElement | null>(null);
  const minValueDisplayRef = useRef<HTMLSpanElement | null>(null);
  const maxValueDisplayRef = useRef<HTMLSpanElement | null>(null);

  const minPrice = 0;
  const maxPrice = 10000;
  const [currentMin, setCurrentMin] = useState(minPrice);
  const [currentMax, setCurrentMax] = useState(maxPrice);

  const updateSlider = () => {
    if (
      !thumbMinRef.current ||
      !thumbMaxRef.current ||
      !rangeRef.current ||
      !minValueDisplayRef.current ||
      !maxValueDisplayRef.current
    )
      return;

    const minPercent = ((currentMin - minPrice) / (maxPrice - minPrice)) * 100;
    const maxPercent = ((currentMax - minPrice) / (maxPrice - minPrice)) * 100;

    thumbMinRef.current.style.left = `${minPercent}%`;
    thumbMaxRef.current.style.left = `${maxPercent}%`;
    rangeRef.current.style.left = `${minPercent}%`;
    rangeRef.current.style.width = `${maxPercent - minPercent}%`;

    minValueDisplayRef.current.textContent = `$${currentMin}`;
    maxValueDisplayRef.current.textContent = `$${currentMax}`;
  };

  const handleDrag = (e: MouseEvent | TouchEvent, thumb: "min" | "max", isTouch = false) => {
    if (!sliderContainerRef.current) return;

    const rect = sliderContainerRef.current.getBoundingClientRect();
    const startX = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveX = isTouch
        ? (moveEvent as TouchEvent).touches[0].clientX
        : (moveEvent as MouseEvent).clientX;
      let percent = ((moveX - rect.left) / rect.width) * 100;
      percent = Math.max(0, Math.min(100, percent));

      const newValue = Math.round(minPrice + (percent / 100) * (maxPrice - minPrice));

      if (thumb === "min" && newValue < currentMax) {
        setCurrentMin(newValue);
      } else if (thumb === "max" && newValue > currentMin) {
        setCurrentMax(newValue);
      }
    };

    const onEnd = () => {
      document.removeEventListener(isTouch ? "touchmove" : "mousemove", onMove);
      document.removeEventListener(isTouch ? "touchend" : "mouseup", onEnd);
    };

    document.addEventListener(isTouch ? "touchmove" : "mousemove", onMove);
    document.addEventListener(isTouch ? "touchend" : "mouseup", onEnd);
  };

  useEffect(() => {
    updateSlider();
  }, [currentMin, currentMax]);

  return (
    <div className="slider-container select-none" ref={sliderContainerRef}>
      <div className="track">
        <div className="range bg-primary h-full" ref={rangeRef}></div>
      </div>

      <div
        className="thumb  bg-secondary border-2 border-primary "
        ref={thumbMinRef}
        style={{ left: "0%" }}
        onMouseDown={(e) => handleDrag(e as any, "min")}
        onTouchStart={(e) => handleDrag(e as any, "min", true)}
      ></div>
      <div
        className="thumb  bg-secondary border-2 border-primary "
        ref={thumbMaxRef}
        style={{ left: "100%" }}
        onMouseDown={(e) => handleDrag(e as any, "max")}
        onTouchStart={(e) => handleDrag(e as any, "max", true)}
      ></div>
      <div className="price-values">
        <span ref={minValueDisplayRef}>$0</span>
        <span ref={maxValueDisplayRef}>$10000</span>
      </div>
    </div>
  );
};

export default RangeSlider;
