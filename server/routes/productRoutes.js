import { Router } from "express";
import * as productController from "../controllers/productController.js";
import { optionalAuth, requireAdmin } from "../middlewares/authMiddleware.js";
import { reviewLimiter } from "../middlewares/rateLimiter.js";
import {
  validateProduct,
  validateProductUpdate,
  validateReview
} from "../middlewares/validators.js";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", requireAdmin, validateProduct, productController.createProduct);
router.put("/:id", requireAdmin, validateProductUpdate, productController.updateProduct);
router.delete("/:id", requireAdmin, productController.deleteProduct);

// Reviews sub-resource
router.get("/:productId/reviews", productController.getProductReviews);
router.post("/:productId/reviews", optionalAuth, reviewLimiter, validateReview, productController.addProductReview);
router.put("/:productId/reviews/:reviewId/moderate", requireAdmin, productController.moderateReview);

export default router;
