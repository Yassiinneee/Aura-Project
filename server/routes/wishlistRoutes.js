import { Router } from "express";
import * as wishlistController from "../controllers/wishlistController.js";
import { optionalAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", optionalAuth, wishlistController.getWishlist);
router.post("/", optionalAuth, wishlistController.addToWishlist);
router.post("/:productId", optionalAuth, wishlistController.addToWishlist);
router.delete("/:productId", optionalAuth, wishlistController.removeFromWishlist);
router.delete("/", optionalAuth, wishlistController.removeFromWishlist);

export default router;
