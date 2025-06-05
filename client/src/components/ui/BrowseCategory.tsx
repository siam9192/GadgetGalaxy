import { ICategory } from "@/types/category.type";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { FaAngleRight } from "react-icons/fa";

interface IProps {
  isLast: boolean;
  category: ICategory;
}

const BrowseCategory = ({ isLast, category }: IProps) => {
  const [isActive, setIsActive] = useState(false);
  const total = 6;
  const ref = useRef<HTMLDivElement>(null);

  const client = ref.current?.getBoundingClientRect();
  const clientTop = client?.top;
  const clientLeft = client?.left;
  const router = useRouter()
  const handelBrowse = ()=>{
   if(! category.children.length ) {
      router.push(`/product-category/${category.slug}`)
   }
  }
  return (
    <div ref={ref} onClick={handelBrowse} onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
      <button
        className={`flex items-center justify-between font-secondary py-3 w-full ${isLast ? " border-b border-gray-600/10" : null} hover:bg-gray-100 px-3 group`}
      >
        <div className="gap-2 flex items-center">
          <p className=" text-wrap">{category.name.trim()}</p>
        </div>
        {category.children.length ? (
          <span>
            <FaAngleRight />
          </span>
        ) : null}
      </button>
      {isActive && category.children.length ? (
        <div
          className="fixed  w-lg  overflow-y-auto no-scrollbar  bg-white  py-2 transition-opacity duration-100  "
          style={{ top: `${clientTop}px`, left: `${clientLeft! + client?.width!}px` }}
        >
          {category.children.map((_, index) => (
            <BrowseCategory category={_} key={index} isLast={index == total - 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default BrowseCategory;
