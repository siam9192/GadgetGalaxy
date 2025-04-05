import React from "react";
interface IProps {
  isLast: boolean;

  category: ICategory;
}

interface ICategory {
  name: string;
  slug: string;
  imageUrl: string;

  subCategories: ICategory[];
}
const ResponsiveBrowseCategory = ({}: IProps) => {
  return <div>ResponsiveBrowseCategory</div>;
};

export default ResponsiveBrowseCategory;
