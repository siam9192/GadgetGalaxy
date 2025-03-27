"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = __importDefault(
  require("../../middlewares/validateRequest"),
);
const discount_validation_1 = __importDefault(require("./discount.validation"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const discount_controller_1 = __importDefault(require("./discount.controller"));
const router = (0, express_1.Router)();
router.post(
  "/",
  (0, validateRequest_1.default)(
    discount_validation_1.default.CreateDiscountValidation,
  ),
  discount_controller_1.default.createDiscount,
);
router.put(
  "/:id",
  (0, validateRequest_1.default)(
    discount_validation_1.default.UpdateDiscountValidation,
  ),
  discount_controller_1.default.updateDiscount,
);
router.get("/", discount_controller_1.default.getDiscounts);
router.get("/manage", discount_controller_1.default.getDiscountsForManage);
router.patch(
  "/change-status",
  (0, validateRequest_1.default)(
    discount_validation_1.default.ChangeDiscountStatusValidation,
  ),
  discount_controller_1.default.changeDiscountStatus,
);
router.post(
  "/apply",
  (0, auth_1.default)([client_1.UserRole.CUSTOMER]),
  (0, validateRequest_1.default)(
    discount_validation_1.default.ApplyDiscountValidation,
  ),
  discount_controller_1.default.applyDiscount,
);
const DiscountRouter = router;
exports.default = DiscountRouter;
