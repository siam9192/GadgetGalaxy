"use client";
import { IProduct, TVariant } from "@/types/product.type";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

interface IProps {
  product: IProduct;
  onChange: (variant: TVariant) => void;
}

const ProductVariants = ({ product, onChange }: IProps) => {
  if (!product.variants.length) return null;
  const variants = product.variants;
  const colors = Array.from(
    new Map(
      variants.map(({ colorName, colorCode }) => [colorName, { colorName, colorCode }]),
    ).values(),
  );

  const featuredVariant = variants.find((v) => v.isHighlighted) || variants[0];
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

  const router = useRouter();

  useEffect(() => {
    // router.push(`?v=${selectedVariant}`)
    onChange && onChange(variants.find((v) => v.id === selectedVariant)!);
  }, [selectedVariant]);

  useEffect(() => {
    setSelectedVariant(items[0].id);
  }, [selectedColorName]);

  return (
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
        <div className="mt-4  space-y-2  select-none">
          {items.map((i) => {
            if (!(i.attributes && i.attributes.length)) {
              return null;
            }

            return (
              <div
                key={i.id}
                onClick={() => setSelectedVariant(i.id)}
                className={`md:p-4 p-3  flex md:flex-row flex-col md:items-center gap-2   text-sm rounded-md ${selectedVariant === i.id ? "bg-secondary text-black" : " bg-gray-50 border-2 border-blue-100 "} hover:cursor-pointer `}
              >
                <input
                  type="radio"
                  id={i.id.toString()}
                  name="att"
                  className="md:size-6 size-5 accent-primary   hidden"
                />
                <label htmlFor={i.id.toString()} className="hover:cursor-pointer">
                  {i.attributes}
                </label>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default ProductVariants;
