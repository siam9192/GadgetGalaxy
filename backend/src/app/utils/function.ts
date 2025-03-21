import crypto from "crypto";

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export function generateSlug(name: string) {
  return name
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .trim(); // Remove leading/trailing spaces
}

export function generateTransactionId(length = 10) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let transactionId = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    transactionId += characters[randomIndex];
  }
  return transactionId;
}

export const calculateDiscountPercentage = (
  price: number,
  offerPrice?: number,
) => {
  if (!offerPrice) return 0;
  //  If regular price not equal with sale price then calculate discountPercentage and assign it
  const discountAmount = price - offerPrice;
  const discountPercentage = Math.floor((discountAmount / offerPrice) * 100);
  return discountPercentage;
};
