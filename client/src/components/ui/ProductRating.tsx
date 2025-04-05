import React from "react";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";

interface IProps {
  rating:number
}

const ProductRating = ({rating}:IProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className=" text-info flex items-center gap-1 text-sm">
        <span>
          <IoIosStar />
        </span>
        <span>
          <IoIosStar />
        </span>
        <span>
          <IoIosStar />
        </span>
        <span>
          <IoIosStar />
        </span>
        <span>
          <IoIosStarHalf />
        </span>
      </div>
      <p className="text-gray-400 text-sm">({rating})</p>
    </div>
  );
};

export default ProductRating;
