"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const deliveryHoursSchema = zod_1.z.string().refine((hours) => {
    // Check if it's a single number (e.g., "24")
    if (/^\d+$/.test(hours))
        return true;
    // Check if it's a valid range "X-Y"
    const match = hours.match(/^(\d+)-(\d+)$/);
    if (!match)
        return false;
    const [_, min, max] = match;
    return parseInt(min, 10) < parseInt(max, 10); // Ensure min < max
}, { message: "Invalid format. Must be 'X' or 'X-Y' where X < Y." });
const CreateShippingChargeValidation = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
    cost: zod_1.z.number().min(1, "Cost must be at least 1"),
    deliveryHours: deliveryHoursSchema, // Reusable validation
});
const UpdateShippingChargeValidation = CreateShippingChargeValidation.partial();
const ShippingChargeValidations = {
    CreateShippingChargeValidation,
    UpdateShippingChargeValidation,
};
exports.default = ShippingChargeValidations;
