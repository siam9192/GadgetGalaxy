import Link from "next/link";
import React from "react";

const CategoryCard = () => {
  return (
    <Link href={"/product-category/category"}>
      <div className="md:p-5 p-2 bg-blue-50 rounded-md border-2 border-blue-700/15">
        <div>
          <img src="https://gadgetz.com.bd/wp-content/uploads/2024/04/10000mAh.png" alt="" />
        </div>
        <h6 className="uppercase text-[0.7rem] text-center mt-3 font-medium  opacity-60">
          Camera and Smartphones
        </h6>
        <p className="text-sm text-center mt-2 font-medium">
          Products <span className="text-info">(23)</span>
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
