"use client";
import React from "react";
import AddToCart from "./AddToCart";
const variants = [
  {
    id: "ckv123abc456",
    productId: "prod001",
    sku: "GG-001-BLK",
    colorName: "Black",
    colorCode: "#000000",
    attributes: [
      { name: "Size", value: "M" },
      { name: "Material", value: "Cotton" },
      { name: "Origin", value: "China" },
      { name: "Origin", value: "UK" },
    ],
    salePrice: 49.99,
    regularPrice: 59.99,
    discountPercentage: 17,
    stock: 25,
  },
  {
    id: "ckv789def012",
    productId: "prod002",
    sku: "GG-002-WHT",
    colorName: "White",
    colorCode: "#FFFFFF",
    attributes: [
      { name: "Size", value: "L" },
      { name: "Material", value: "Polyester" },
      { name: "Origin", value: "China" },
    ],
    salePrice: 39.99,
    regularPrice: 49.99,
    discountPercentage: 20,
    stock: 18,
  },
  {
    id: "ckv345ghi678",
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
    id: "ckv901jkl234",
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

const ChoseProductVariant = () => {
  const attNames: string[] = [];
  const colorCodes: string[] = [];
  const colorNames: string[] = [];
  variants.forEach((variant) => {
    variant.attributes.forEach((ele) => {
      if (!attNames.includes(ele.name)) attNames.push(ele.name);
    });
    if (!colorCodes.includes(variant.colorCode)) colorCodes.push(variant.colorCode);
    if (!colorNames.includes(variant.colorName)) colorNames.push(variant.colorName);
  });

  const selectedVariantId = variants[0].id;
  const variantAttributes = variants.find((ele) => ele.id === selectedVariantId)!.attributes;

  const groupedAttributes = variantAttributes.reduce<{ name: string; value: string[] }[]>(
    (acc, attr) => {
      const existingAttr = acc.find((item) => item.name === attr.name);

      if (existingAttr) {
        existingAttr.value.push(attr.value);
      } else {
        acc.push({ name: attr.name, value: [attr.value] });
      }

      return acc;
    },
    [],
  );

  return (
    <>
      <div className="mt-3 ">
        <div className="space-y-4">
          <div className="flex items-center gap-5">
            <h6 className="font-semibold font-primary opacity-90 ">Color:</h6>
            <div className="mt-2 flex items-center gap-2">
              {variants.map((item) => {
                return (
                  <div
                    key={item.colorCode}
                    className="size-7 rounded-md p-2 border-2 border-gray-900/20"
                    style={{ backgroundColor: `${item.colorCode}` }}
                  ></div>
                );
              })}
            </div>
          </div>
          {groupedAttributes.map((item) => (
            <div key={item.name} className="flex items-center gap-5">
              <h6 className="font-semibold  opacity-90 ">{item.name}:</h6>

              <div className="flex items-center gap-2">
                {item.value.map((item, index) => {
                  return (
                    <button
                      key={index}
                      className=" border-2 px-6 py-2  rounded-md border-blue-100 "
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3">{/* <AddToCart /> */}</div>
    </>
  );
};

export default ChoseProductVariant;
