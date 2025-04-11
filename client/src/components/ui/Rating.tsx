import React from "react";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";
import { IoStarOutline } from "react-icons/io5";

interface IProps {
  rating: number;
}

const Rating = ({ rating }: IProps) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // full star
      stars.push(<IoIosStar />);
    } else if (rating >= i - 0.5) {
      // half star
      stars.push(<IoIosStarHalf />);
    } else {
      // empty star
      stars.push(<IoStarOutline />);
    }
  }
  return (
    <div className="flex items-center gap-2">
      <div className=" text-info flex items-center gap-1 ">
        {stars.map((str, idx) => (
          <span key={idx}>{str}</span>
        ))}
      </div>
      <p className="text-gray-400 text-sm">({rating})</p>
    </div>
  );
};

export default Rating;
