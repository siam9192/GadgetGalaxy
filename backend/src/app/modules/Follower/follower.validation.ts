import { z } from "zod";

const CreateFollowerValidation = z.object({
  shopId: z.string(),
});

// const DeleteFollowerValidation

const FollowerValidations = {
  CreateFollowerValidation,
};

export default FollowerValidations;
