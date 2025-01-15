import { SocialPlatform } from "@prisma/client";
import { z } from "zod";

const UpdateStaffProfileValidation = z
  .object({
    first_name: z.string(),
    last_name: z.string(),
    profile_photo: z.string().url().optional(),
  })
  .partial();

const UpdateReaderProfileValidation = z
  .object({
    first_name: z.string(),
    last_name: z.string(),
    profile_photo: z.string().url().optional(),
  })
  .partial();

const UpdateSocialLinkValidation = z.object({
  platform: z.enum(Object.values(SocialPlatform) as [string, ...string[]]),
  url: z.string().url(),
  isDeleted: z.boolean().default(false),
});

const UpdateAuthorProfileValidation = z
  .object({
    first_name: z.string(),
    last_name: z.string(),
    profile_photo: z.string().url().optional(),
    social_links: z.array(UpdateSocialLinkValidation),
  })
  .partial();

const ProfileValidations = {
  UpdateStaffProfileValidation,
  UpdateReaderProfileValidation,
  UpdateAuthorProfileValidation,
};

export default ProfileValidations;
