import React from "react";
import { categories } from "../../../data/categories";
import ResponsiveBrowseCategory from "./ResponsiveBrowseCategory";

const ResponsiveBrowseCategories = () => {
  return (
    <div>
      {categories.map((_, index) => (
        <ResponsiveBrowseCategory
          category={_}
          isLast={index + 1 === categories.length}
          key={index}
        />
      ))}
    </div>
  );
};

export default ResponsiveBrowseCategories;
