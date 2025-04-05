import { getSearchRelatedBrand } from "@/services/brand.service";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchRelatedBrands = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";
  const [brands, setBrands] = useState<IBrand[]>([]);
  useEffect(() => {
    fetchBrands();
  }, [searchParams]);

  async function fetchBrands() {
    const params = [
      {
        name: "searchTerm",
        value: searchTerm,
      },
    ];
    try {
      const brands = await getSearchRelatedBrand(params);
      if (brands && brands.length) {
        setBrands(brands);
      } else {
        throw new Error();
      }
    } catch (error) {}
  }

  return (
    <div className="bg-white p-4">
      <h6 className="uppercase font-medium">Brands</h6>
      <div className="mt-5 max-h-[400px] overflow-y-auto">
        {brands.map((_, index) => (
          <div key={index} className="py-2 flex items-center gap-2">
            <img
              src={_.logoUrl || "https://gadgetz.com.bd/wp-content/uploads/2022/01/Havit-logo.png"}
              alt=""
              className="w-1/5"
            />
            <p className="text-lg text-gray-800 opacity-60">{_.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchRelatedBrands;
