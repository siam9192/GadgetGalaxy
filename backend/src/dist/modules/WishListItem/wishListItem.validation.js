"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const CreateWishListItemValidation = zod_1.z.object({
  productId: zod_1.z.number(),
});
const WishListItemValidations = {
  CreateWishListItemValidation,
};
exports.default = WishListItemValidations;
