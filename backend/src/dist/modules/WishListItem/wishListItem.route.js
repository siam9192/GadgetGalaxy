"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const wishListItem_controller_1 = __importDefault(
  require("./wishListItem.controller"),
);
const validateRequest_1 = __importDefault(
  require("../../middlewares/validateRequest"),
);
const wishListItem_validation_1 = __importDefault(
  require("./wishListItem.validation"),
);
const router = (0, express_1.Router)();
router.post(
  "/",
  (0, auth_1.default)([client_1.UserRole.CUSTOMER]),
  (0, validateRequest_1.default)(
    wishListItem_validation_1.default.CreateWishListItemValidation,
  ),
  wishListItem_controller_1.default.createWishListItem,
);
router.delete(
  "/:productId",
  wishListItem_controller_1.default.deleteWishListItem,
);
router.get("/my", wishListItem_controller_1.default.getMyWishListItems);
const WishListItemRouter = router;
exports.default = WishListItemRouter;
