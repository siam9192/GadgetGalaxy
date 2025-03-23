import { z } from "zod";

const deliveryHoursSchema = z.string().refine(
  (hours) => {
    // Check if it's a single number (e.g., "24")
    if (/^\d+$/.test(hours)) return true;

    // Check if it's a valid range "X-Y"
    const match = hours.match(/^(\d+)-(\d+)$/);
    if (!match) return false;

    const [_, min, max] = match;
    return parseInt(min, 10) < parseInt(max, 10); // Ensure min < max
  },
  { message: "Invalid format. Must be 'X' or 'X-Y' where X < Y." },
);

const CreateShippingChargeValidation = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  cost: z.number().min(1, "Cost must be at least 1"),
  deliveryHours: deliveryHoursSchema, // Reusable validation
});

const UpdateShippingChargeValidation = CreateShippingChargeValidation.partial();

const ShippingChargeValidations = {
  CreateShippingChargeValidation,
  UpdateShippingChargeValidation,
};

export default ShippingChargeValidations;
