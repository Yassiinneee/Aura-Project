import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { optionalAuth, requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";
import { orderLimiter } from "../middlewares/rateLimiter.js";
import { validateOrder, validateOrderStatus } from "../middlewares/validators.js";

const router = Router();

router.post("/", optionalAuth, orderLimiter, validateOrder, orderController.createOrder);
router.get("/", optionalAuth, orderController.getOrders);
router.get("/all", requireAdmin, orderController.getAllOrdersAdmin);
router.get("/admin/all", requireAdmin, orderController.getAllOrdersAdmin);
router.get("/:orderId", optionalAuth, orderController.getOrderById);
router.put("/:orderId/status", requireAdmin, validateOrderStatus, orderController.updateOrderStatus);
router.patch("/:orderId/status", requireAdmin, validateOrderStatus, orderController.updateOrderStatus);
router.get("/:orderId/invoice", orderController.downloadInvoice);

export default router;
