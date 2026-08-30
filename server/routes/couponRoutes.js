import { Router } from "express";
import * as couponController from "../controllers/couponController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import { validateCoupon, validateCouponCheck } from "../middlewares/validators.js";

const router = Router();

router.get("/", requireAdmin, couponController.getAllCoupons);
router.post("/", requireAdmin, validateCoupon, couponController.createCoupon);
router.delete("/:id", requireAdmin, couponController.deleteCoupon);
router.post("/validate", validateCouponCheck, couponController.validateCoupon);

export default router;
