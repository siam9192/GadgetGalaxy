import { NotificationType } from "@prisma/client";

export interface ICreateNotificationPayload {
  usersId: number[];
  type: `${NotificationType}`;
  title: string;
  message: string;
  imageUrl?: string;
}

export interface IFilterNotifications {
  userId?: string;
  type?: `${NotificationType}`;
  startDate?: string;
  endDate?: string;
}
