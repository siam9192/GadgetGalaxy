import { DiscountStatus, DiscountType } from "@prisma/client";
import { z } from "zod";

export const CreateDiscountValidation = z.object({
  code: z.string().nonempty("Discount code is required."),
  title: z.string().min(3).max(200),
  description: z.string().nonempty("Description is required."),
  discountType: z.enum(Object.values(DiscountType) as any),
  discountValue: z.number().positive("Discount value must be positive."),
  minOrderValue: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().positive().min(1).optional(),
  usageCount: z.number().nonnegative().optional(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  customersId: z
    .array(z.string())
    .nonempty("Customers ID array cannot be empty.")
    .optional(),
  categoriesId: z
    .array(z.string())
    .nonempty("Categories ID array cannot be empty.")
    .optional(),
  status: z.enum(Object.values(DiscountStatus) as any).optional(),
});

export const UpdateDiscountValidation = z.object({
  code: z.string().optional(),
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(2000).optional(),
  discountType: z.enum(Object.values(DiscountType) as any).optional(),
  discountValue: z.number().positive().optional(),
  minOrderValue: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().positive().optional(),
  usageCount: z.number().nonnegative().optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  new: z
    .object({
      customersId: z.array(z.number()).optional(),
      categoriesId: z.array(z.number()).optional(),
    })
    .optional(),
  removed: z
    .object({
      customersId: z.array(z.number()).optional(),
      categoriesId: z.array(z.number()).optional(),
    })
    .optional(),
  status: z.enum(Object.values(DiscountStatus) as any).optional(),
});

export const ApplyDiscountValidation = z.object({
  code: z.string(),
  cartItemsId: z.array(z.string()),
});
export const ChangeDiscountStatusValidation = z.object({
  id: z.number().positive(),
  status: z.nativeEnum(DiscountStatus),
});

const DiscountValidations = {
  CreateDiscountValidation,
  UpdateDiscountValidation,
  ChangeDiscountStatusValidation,
  ApplyDiscountValidation,
};

export default DiscountValidations;
