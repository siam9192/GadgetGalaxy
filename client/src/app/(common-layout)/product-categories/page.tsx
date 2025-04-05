import CategoryCard from "@/components/cards/CategoryCard";
import { getCategories } from "@/services/category.service";
import React from "react";

const page = async() => {
  const data =  await getCategories([{name:"limit",value:100}])
  const categories =  data?.data||[]
  const meta = data?.meta

  
  return (
    <div className="bg-white shadow-xl md:p-10 p-5 md:my-5 my-2">
      <div>
        <h1 className="text-2xl font-primary font-semibold uppercase text-center relative flex items-center justify-center">
          <span
            className="before:content-[''] before:block before:w-16 before:h-[2px] before:bg-gray-500 before:mr-3 
                   after:content-[''] after:block after:w-16 after:h-[2px] after:bg-gray-500 after:ml-3"
          >
            Product <span className="text-info">Categories</span>
          </span>
        </h1>
      </div>
      <div className="mt-10 grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4">
        {categories.map((_, index) => (
          <CategoryCard category={_} key={index} />
        ))}
      </div>
    </div>
  );
};

export default page;
