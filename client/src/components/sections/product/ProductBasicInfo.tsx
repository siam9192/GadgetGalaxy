"use client";
import AddToCart from "@/components/ui/AddToCart";
import React, { useState } from "react";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";
const variants = [
  {
    id: "ckv12abc456",
    productId: "prod001",
    sku: "GG-001-BLK",
    colorName: "Black",
    colorCode: "#000000",
    attributes: [
      { name: "Size", value: "M" },
      { name: "Material", value: "Cotton" },
      { name: "Origin", value: "China" },
      {
        name: "Storage",
        value: "128GB",
      },
    ],
    salePrice: 49.99,
    regularPrice: 59.99,
    discountPercentage: 17,
    stock: 25,
  },
  {
    id: "ckv789def02",
    productId: "prod002",
    sku: "GG-002-WHT",
    colorName: "White",
    colorCode: "#FFFFFF",
    attributes: [
      { name: "Size", value: "L" },
      { name: "Material", value: "Polyester" },
      { name: "Origin", value: "China" },
      {
        name: "Storage",
        value: "256GB",
      },
      {
        name: "Ram",
        value: "12GB",
      },
    ],
    salePrice: 39.99,
    regularPrice: 49.99,
    discountPercentage: 20,
    stock: 18,
  },
  {
    id: "cv789def012",
    productId: "prod002",
    sku: "GG-002-WHT",
    colorName: "White",
    colorCode: "#FFFFFF",
    attributes: [
      { name: "Size", value: "X" },
      { name: "Origin", value: "Global" },
      {
        name: "Storage",
        value: "64GB",
      },
    ],

    salePrice: 39.99,
    regularPrice: 49.99,
    discountPercentage: 20,
    stock: 18,
    isFeatured: true,
  },
  {
    id: "ckv79def012",
    productId: "prod002",
    sku: "GG-002-WHT",
    colorName: "White",
    colorCode: "#FFFFFF",
    attributes: [
      { name: "Size", value: "L" },
      { name: "Material", value: "Polyester" },
      { name: "Origin", value: "China" },
      {
        name: "Storage",
        value: "356GB",
      },
    ],
    salePrice: 39.99,
    regularPrice: 49.99,
    discountPercentage: 20,
    stock: 18,
    isFeatured: true,
  },
  {
    id: "ck345ghi678",
    productId: "prod003",
    sku: "GG-003-RED",
    colorName: "Red",
    colorCode: "#FF0000",
    attributes: [
      { name: "Size", value: "S" },
      { name: "Material", value: "Wool" },
    ],
    salePrice: 69.99,
    regularPrice: 79.99,
    discountPercentage: 13,
    stock: 10,
  },
  {
    id: "ckv901jkl23",
    productId: "prod004",
    sku: "GG-004-BLU",
    colorName: "Blue",
    colorCode: "#0000FF",
    attributes: [
      { name: "Size", value: "XL" },
      { name: "Material", value: "Denim" },
    ],
    salePrice: 89.99,
    regularPrice: 99.99,
    discountPercentage: 10,
    stock: 5,
  },
];

const ProductBasicInfo = () => {
  const colors = Array.from(
    new Map(
      variants.map(({ colorName, colorCode }) => [colorName, { colorName, colorCode }]),
    ).values(),
  );
  const featuredVariant = variants.find((v) => v.isFeatured) || variants[0];
  const [selectedColorName, setSelectedColorName] = useState(featuredVariant.colorName);
  const [selectedVariant, setSelectedVariant] = useState(featuredVariant.id);

  function filterAttributes(
    color: string,
    selectedAttributeName: string,
    selectedAttributeValue: string,
  ) {
    const filteredVariants = variants.filter(
      (v) =>
        v.colorName === color &&
        v.attributes.some(
          (attr) => attr.name === selectedAttributeName && attr.value === selectedAttributeValue,
        ),
    );

    const attributesMap = new Map();

    filteredVariants.forEach((variant) => {
      variant.attributes.forEach((attr) => {
        if (!attributesMap.has(attr.name)) {
          attributesMap.set(attr.name, new Set());
        }
        attributesMap.get(attr.name).add(attr.value);
      });
    });

    // Convert map to object with arrays
    const updatedAttributes = {} as any;
    attributesMap.forEach((values, key) => {
      updatedAttributes[key] = Array.from(values);
    });

    return updatedAttributes;
  }

  const colorVariants = variants.filter((variant) => variant.colorName === selectedColorName);

  const items = colorVariants.map((variant) => {
    const attributesString = variant.attributes
      .map((attr) => `${attr.name}: ${attr.value}`) // Format each attribute as "Key: Value"
      .join(" | "); // Join them with a pipe separator

    return {
      id: variant.id,
      attributes: attributesString,
    };
  });

  // const handelColorChange = ()

  return (
    <div className="p-5  bg-white  ">
      <div>
        <p className="text-end font-medium">
          <span className="text-primary ">SKU</span>: 6T6GFYUT
        </p>
        <p className="text-info ">Out of stock</p>
        <h1 className="md:text-3xl text-2xl font-primary text-black  ">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        </h1>
      </div>
      <div className="mt-3 space-y-2">
        <h5 className="md:text-4xl text-3xl text-primary font-semibold font-primary">
          $24.88 <del className="text-2xl text-gray-700">$40</del>
        </h5>

        <div className="flex items-center gap-2">
          <div className=" text-info flex items-center gap-1">
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
          <p className="text-gray-400 text-sm">(03)</p>
        </div>
        <p className="text-sm text-gray-800/80">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quod sunt ipsa
          accusantium accusamus fuga ex ut numquam repellendus aliquam!
        </p>
      </div>
      <div className="mt-3 ">
        <form>
          <div className="flex items-center gap-5">
            <h6 className="font-semibold opacity-90">Color:</h6>
            <div className="mt-2 flex items-center gap-2">
              {colors.map(({ colorName, colorCode }) => (
                <button
                  key={colorCode}
                  type="button"
                  onClick={() => setSelectedColorName(colorName)}
                  className={`size-7 rounded-full p-2 border border-gray-900/40 ${selectedColorName === colorName ? "outline-info outline-2 outline-offset-2" : ""}`}
                  style={{ backgroundColor: colorCode }}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {items.map((i) => (
              <div
                key={i.id}
                onClick={() => setSelectedVariant(i.id)}
                className={`md:p-4 p-3  flex md:flex-row flex-col md:items-center gap-2   text-sm rounded-md ${selectedVariant === i.id ? "bg-secondary text-black" : " bg-gray-50 border-2 border-blue-100 "} hover:cursor-pointer `}
              >
                <input
                  type="radio"
                  id={i.id}
                  name="att"
                  className="md:size-6 size-5 accent-primary   hidden"
                />
                <label htmlFor={i.id} className="hover:cursor-pointer">
                  {i.attributes}
                </label>
              </div>
            ))}
          </div>
        </form>
      </div>
      <div className="mt-3">
        <AddToCart />
      </div>
      <p className="mt-3 font-secondary text-info text-sm">
        ঢাকার বাহীরের অর্ডারের ক্ষেত্রে ৩০০ টাকা 01888 719 119 বিকাশ মার্চেন্ট নাম্বারে Make Payment
        করে অর্ডার নিশ্চিত করুন ।অন্যথায় অর্ডার ক্যান্সেল হয়ে যাবে ।
      </p>
    </div>
  );
};

export default ProductBasicInfo;
