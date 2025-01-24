import { NotificationType } from "@prisma/client";
import { z } from "zod";

const CreateNotificationValidation = z.object({
  usersId: z.array(z.string().nonempty()).optional(),
  type: z.nativeEnum(NotificationType),
  title: z.string(),
  message: z.string(),
  imageUrl: z.string(),
});

const NotificationValidations = {
  CreateNotificationValidation,
};

export default NotificationValidations;
