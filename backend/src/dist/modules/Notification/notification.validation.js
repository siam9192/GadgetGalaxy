"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const CreateNotificationValidation = zod_1.z.object({
  usersId: zod_1.z.array(zod_1.z.string().nonempty()).optional(),
  type: zod_1.z.nativeEnum(client_1.NotificationType),
  title: zod_1.z.string(),
  message: zod_1.z.string(),
  imageUrl: zod_1.z.string(),
});
const NotificationValidations = {
  CreateNotificationValidation,
};
exports.default = NotificationValidations;
