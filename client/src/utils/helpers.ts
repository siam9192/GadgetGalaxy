import { IProduct, TCardProduct } from "@/types/product.type";
import { IParam, TPricing } from "@/types/util.type";

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
  return "?" +( str ? str : "");
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
