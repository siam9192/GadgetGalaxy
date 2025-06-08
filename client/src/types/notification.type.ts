export interface INotification {
  _id: string;
  userId: string;
  type: ENotificationCategory;
  category: ENotificationCategory;
  title: string;
  message: string;
  imageUrl?: string;
  href?: string;
  isRead: boolean;
  metaData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export enum ENotificationCategory {
  SYSTEM = "SYSTEM",
  ORDER = "ORDER",
  WISHLIST = "WISHLIST",
  CARTITEM = "CARTITEM",
  PRODUCT = "PRODUCT",
  CATEGORY = "CATEGORY",
  PROMOTION = "PROMOTION",
  COUPON = "COUPON",
}

export enum ENotificationType {
  INFO,
  WARNING,
}
