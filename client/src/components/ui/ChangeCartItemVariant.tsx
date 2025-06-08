"use client";
import { useChangeCartVariantMutation } from "@/redux/features/cart/cart.api";
import { getProductVariants } from "@/services/product.service";
import { ICartItem } from "@/types/cartItem.type";
import { TVariant } from "@/types/product.type";
import React, { useEffect, useState } from "react";

interface IProps {
  onChange?: () => void;
  item: ICartItem;
}

const ChangeCartItemVariant = ({ item, onChange }: IProps) => {
  const [variants, setVariants] = useState<TVariant[]>([]);
  useEffect(() => {
    getProductVariants(item.product.id).then((res) => {
      if (res?.success) {
        setVariants(res.data);
      }
    });
  }, []);

  const [selectedVariantId, setSelectedVariantId] = useState(item.product.variant.id);
  const [selectedColorName, setSelectedColorName] = useState(item.product.variant.colorName);

  const colors = Array.from(
    new Map(
      variants.map(({ colorName, colorCode }) => [colorName, { colorName, colorCode }]),
    ).values(),
  );
  const colorVariants = variants.filter((variant) => variant.colorName === selectedColorName);

  const items = colorVariants.map((variant) => {
    const attributesString = variant.attributes
      .map((attr) => `${attr.name}: ${attr.value}`) // Format each attribute as "Key: Value"
      .join(" | ");
    return { ...variant, attributesString };
  }); // Join them with a pipe separator

  useEffect(() => {
    if (!variants.length) return;
    const v = colorVariants[0].id;
  }, [selectedColorName, variants]);

  const [changeVariant] = useChangeCartVariantMutation();

  const handelChangeVariant = async () => {
    try {
      await changeVariant({ id: item.id, variantId: selectedVariantId });
    } catch (error) {
    } finally {
      onChange && onChange();
    }
  };
  return (
    <div>
      <h2 className="font-medium text-xl text-black">Variants</h2>
      <div className="mt-5">
        <div className="mt-3">
          <p className="font-medium">Colors:</p>
          <div className="mt-2 flex items-center gap-2">
            {colors.map(({ colorName, colorCode }) => (
              <button
                key={colorCode}
                type="button"
                onClick={() => setSelectedColorName(colorName)}
                className={`size-5 rounded-full p-2 border border-gray-900/40 ${selectedColorName === colorName ? "outline-info outline-2 outline-offset-2" : ""}`}
                style={{ backgroundColor: colorCode }}
              />
            ))}
          </div>
        </div>
        {variants.length ? (
          <div className="mt-2">
            <p className="font-medium">Attributes:</p>
            <div className="mt-3 space-y-2">
              {items.map((i) => {
                return (
                  <div
                    key={i.id}
                    onClick={() => setSelectedVariantId(i.id)}
                    className={`md:p-4 p-3  flex md:flex-row flex-col md:items-center gap-2   text-sm rounded-md ${selectedVariantId === i.id ? "bg-secondary text-black" : " bg-gray-50 border-2 border-blue-100 "} hover:cursor-pointer `}
                  >
                    <input
                      type="radio"
                      id={i.id.toString()}
                      name="att"
                      className="md:size-6 size-5 accent-primary   hidden"
                    />
                    <label htmlFor={i.id.toString()} className="hover:cursor-pointer">
                      {i.attributesString}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-8 text-end">
        <button
          disabled={selectedVariantId === item.product.variant.id}
          onClick={handelChangeVariant}
          className="px-6 py-3 bg-primary disabled:bg-gray-200 text-white font-medium rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ChangeCartItemVariant;
