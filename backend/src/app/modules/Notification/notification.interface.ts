import { NotificationType } from "@prisma/client";

export interface ICreateNotificationPayload {
  usersId: string[];
  type: `${NotificationType}`;
  title: string;
  message: string;
  imageUrl: string;
}

export interface IFilterNotifications {
  userId?: string;
  type?: `${NotificationType}`;
  startDate?: string;
  endDate?: string;
}
