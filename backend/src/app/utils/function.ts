import { Category, OrderStatus } from "@prisma/client";
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

export const convertExceptedDeliveryDate = (rangeHours: string) => {
  if (rangeHours.includes("-")) {
    const [min, max] = rangeHours.split("");
    const from = new Date();
    from.setHours(from.getHours() + Number(min));
    const to = new Date();
    to.setHours(to.getHours() + Number(max));

    return {
      from,
      to,
    };
  }
  const inDate = new Date();
  inDate.setHours(inDate.getHours() + Number(rangeHours));
  return {
    in: inDate,
  };
};

export function getOrderStatusMessage(status: OrderStatus,orderId:number): {
  title: string;
  message: string;
} {
  switch (status) {
    case OrderStatus.PENDING:
      return {
        title: `Your order "#${orderId}" is pending`,
        message:
          "We have received your order and it is currently pending because we have to verify it for we will contact you shortly. We will notify you once it is processed.",
      };

    case OrderStatus.PLACED:
      return {
     title: `Your order "#${orderId}" has been placed`,
        message:
          "Your order has been successfully placed. We will start processing it soon.",
      };

    case OrderStatus.PROCESSING:
      return {
     title: `Your order "#${orderId}" is being processed`,
        message:
          "Your order is currently being prepared. We will update you once it is shipped.",
      };

    case OrderStatus.IN_TRANSIT:
      return {
        title: `Your order "#${orderId}" is on the way`,
        message:
          "Good news! Your order has been shipped and is on its way to your address.",
      };

    case OrderStatus.DELIVERED:
      return {
        title:  `Your order "#${orderId}" has been delivered`,
        message:
          "Your order has been successfully delivered. We hope you enjoy your purchase!",
      };

    case OrderStatus.RETURNED:
      return {
        title:  `Your order "#${orderId}" has been returned`,
        message:
          "We have received your returned order. If you have any questions, please contact our support team.",
      };

    case OrderStatus.CANCELED:
      return {
        title:  `Your order "#${orderId}" has been canceled`,
        message:
          "Your order has been canceled. If this was a mistake or you need further assistance, please reach out to support.",
      };

    case OrderStatus.FAILED:
      return {
        title:  `Your order "#${orderId}" has been failed`,
        message:
          "Unfortunately, your order could not be processed. Please try again or contact support for assistance.",
      };

    default:
      return {
        title:  `There is an update about your order "#${orderId}" is on the way`,
        message:
          "There is an update regarding your order. Please check your order details.",
      };
  }
}

export const isNumber = (num: string) => isNaN(parseInt(num));

export function getCategoriesWithHierarchyStr(
  categories: (Category & { children: Category[] })[],
) {
  const convert = (
    c: Category & { children: Category[]; hierarchyStr: string },
    ph = "",
  ) => {
    const hierarchyStr = [ph, c.hierarchyStr || c.slug].join("/");
    c.hierarchyStr = hierarchyStr;
    if (c.children && c.children.length) {
      c.children = c.children.map((_) => {
        return convert(_ as any, hierarchyStr);
      });
    }
    return c;
  };
  return categories.map((_) => convert(_ as any));
}
