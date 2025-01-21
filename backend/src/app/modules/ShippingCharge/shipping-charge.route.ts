import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import ShippingChargeValidations from "./shipping-charge.validation";
import ShippingChargeControllers from "./shipping-charge.controller";

const router = Router();

router.get("");

router.post(
  "/",
  validateRequest(ShippingChargeValidations.CreateShippingChargeValidation),
  ShippingChargeControllers.createShippingCharge,
);

router.get("/", ShippingChargeControllers.getShippingCharges);

router.put(
  "/:shippingChargeId",
  validateRequest(ShippingChargeValidations.UpdateShippingChargeValidation),
);

router.delete("/:id", ShippingChargeControllers.deleteShippingChargeById);

const ShippingChargeRouter = router;

export default ShippingChargeRouter;
