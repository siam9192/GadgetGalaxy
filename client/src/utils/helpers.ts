import envConfig from "@/config/envConfig";
import { ICartItem } from "@/types/cartItem.type";
import { IProduct, TCardProduct } from "@/types/product.type";
import { IParam, TPricing } from "@/types/util.type";
import axios from "axios";
import { ECDH } from "crypto";
import { removeRequestMeta } from "next/dist/server/request-meta";

export function getProductPricing(product: TCardProduct | IProduct) {
  // Extract the variants of the product
  const variants = product.variants;

  // Initialize the pricing object with the base price from the product
  const pricing: TPricing = {
    price: product.price,
  };

  // Check if the product has variants and that there is at least one variant
  if (variants && variants.length) {
    // Find the highlighted variant or fallback to the first variant if none is highlighted
    const highlighted = variants.find((_) => _.isHighlighted === true) || variants[0];

    // Update the pricing object with the highlighted variant's price and offer price
    pricing.price = highlighted.price;
    pricing.offerPrice = highlighted.offerPrice;
  } else {
    // If no variants, keep the offerPrice from the product (no changes)
    product.offerPrice = product.offerPrice;
  }

  // Return the pricing object with the updated values
  return pricing;
}

export function getParamsToString(params: IParam[]) {
  const urlSearchParams = new URLSearchParams();
  params.forEach(({ name, value }) => {
    urlSearchParams.append(name, value?.toString() || "");
  });

  const str = urlSearchParams.toString();
  return "?" + (str ? str : "");
}

export function urlSearch(searchParams: URLSearchParams, params: IParam[]): string {
  const urlSearchParams = new URLSearchParams(searchParams);

  // Apply new/updated params
  params.forEach(({ name, value }) => {
    const stringValue = value?.toString() ?? "";
    if (stringValue) {
      urlSearchParams.set(name, stringValue);
    } else {
      urlSearchParams.delete(name);
    }
  });

  const queryString = urlSearchParams.toString();
  return queryString ? `?${queryString}` : "";
}
export function getCartItemPrice(item: ICartItem) {
  const { product } = item;
  const price =
    product.variant?.offerPrice ?? product.variant?.price ?? product.offerPrice ?? product.price;

  return price;
}

export const getFormValues = (target: HTMLFormElement, names: string[]) => {
  const obj: Record<string, string> = {};

  names.forEach((name) => {
    const input = target[name];
    if (input) {
      obj[name] = input.value;
    }
  });
  return obj;
};

export function capitalizeFirstWord(str: string) {
  return str.toLowerCase().replace(/\b\w/, (c) => c.toUpperCase());
}

export const uploadImageToImgBB = async (file: File) => {
  const response = await axios.post(
    `${envConfig.img_bb_uploadUrl}?key=${envConfig.img_bb_key}` as string,
    { image: file },
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  const url = response.data.data.display_url;
  if (!url) throw new Error();
  return url;
};

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
