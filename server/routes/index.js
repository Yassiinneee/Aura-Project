import { Router } from "express";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import wishlistRoutes from "./wishlistRoutes.js";
import couponRoutes from "./couponRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import emailRoutes from "./emailRoutes.js";
import auditRoutes from "./auditRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import aiRoutes from "./aiRoutes.js";
import deliveryRoutes from "./deliveryRoutes.js";
import * as auditController from "../controllers/auditController.js";
import * as authController from "../controllers/authController.js";
import * as orderController from "../controllers/orderController.js";
import * as emailController from "../controllers/emailController.js";
import * as analyticsController from "../controllers/analyticsController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import { validateUserRole, validateUserStatus } from "../middlewares/validators.js";

const apiRouter = Router();

// Primary domain routers
apiRouter.use("/auth", authRoutes);
apiRouter.use("/categories", categoryRoutes);
apiRouter.use("/products", productRoutes);
apiRouter.use("/orders", orderRoutes);
apiRouter.use("/wishlist", wishlistRoutes);
apiRouter.use("/coupons", couponRoutes);
apiRouter.use("/inventory", inventoryRoutes);
apiRouter.use("/notifications", notificationRoutes);
apiRouter.use("/email", emailRoutes);
apiRouter.use("/audit", auditRoutes);
apiRouter.use("/payment", paymentRoutes);
apiRouter.use("/upload", uploadRoutes);
apiRouter.use("/ai", aiRoutes);
apiRouter.use("/", deliveryRoutes);

// Admin dashboard & top-level aliases
apiRouter.get("/admin/analytics", requireAdmin, analyticsController.getAdminAnalytics);
apiRouter.get("/admin/audit-logs", requireAdmin, auditController.getAuditLogsController);
apiRouter.get("/admin/emails", requireAdmin, emailController.getEmailLogs);
apiRouter.post("/admin/emails/:emailId/retry", requireAdmin, emailController.retryEmailDelivery);
apiRouter.get("/admin/users", requireAdmin, authController.getAllUsers);
apiRouter.get("/admin/orders", requireAdmin, orderController.getAllOrdersAdmin);

// Top-level /users aliases
apiRouter.get("/users", requireAdmin, authController.getAllUsers);
apiRouter.patch("/users/:userId/role", requireAdmin, validateUserRole, authController.updateUserRole);
apiRouter.put("/users/:userId/role", requireAdmin, validateUserRole, authController.updateUserRole);
apiRouter.patch("/users/:userId/status", requireAdmin, validateUserStatus, authController.updateUserStatus);
apiRouter.put("/users/:userId/status", requireAdmin, validateUserStatus, authController.updateUserStatus);

export default apiRouter;
