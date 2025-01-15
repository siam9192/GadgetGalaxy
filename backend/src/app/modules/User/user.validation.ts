import { z } from "zod";

const ChangeUserStatusValidation = z.object({
  user_id: z.number(),
  status: z.enum(["Active", "Blocked"]),
});

const UserValidations = {
  ChangeUserStatusValidation,
};

export default UserValidations;
