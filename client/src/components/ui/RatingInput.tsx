"use client";
import React, { useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

interface RatingInputProps {
  defaultValue?: number;
  onChange?: (value: number) => void;
}

const RatingInput: React.FC<RatingInputProps> = ({ defaultValue = 1, onChange }) => {
  const [rating, setRating] = useState(defaultValue);
  const max = 5;

  const handleRatingClick = (index: number) => {
    const newRating = index + 1;
    setRating(newRating);
    onChange?.(newRating); // Notify parent component
  };

  return (
    <div className="flex items-center gap-2 text-2xl">
      {Array.from({ length: max }, (_, index) => (
        <span
          key={index}
          onClick={() => handleRatingClick(index)}
          className="cursor-pointer transition-transform transform hover:scale-110"
          role="button"
          aria-label={`Rate ${index + 1} stars`}
        >
          {rating > index ? (
            <BsStarFill className="text-info" />
          ) : (
            <BsStar className="text-gray-400" />
          )}
        </span>
      ))}
    </div>
  );
};

export default RatingInput;
