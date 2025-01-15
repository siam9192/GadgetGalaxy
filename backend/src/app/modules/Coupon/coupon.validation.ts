import { DiscountType } from "@prisma/client";
import { z } from "zod";

const CreateCouponValidation = z.object({
  code: z.string().max(20),
  description: z.string(),
  discountType: z.enum(Object.values(DiscountType) as [string, ...string[]]),
  discountValue: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  minOrderValue: z.number().nonnegative().optional(),
  maxOrderValue: z.number().nonnegative().optional(),
  usageLimit: z.number().nonnegative().optional(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
});

const CouponValidations = {
  CreateCouponValidation,
};

export default CouponValidations;
