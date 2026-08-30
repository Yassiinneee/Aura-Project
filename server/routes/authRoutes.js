import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import {
  validateRegister,
  validateLogin,
  validateUserRole,
  validateUserStatus
} from "../middlewares/validators.js";

const router = Router();

router.post("/register", authLimiter, validateRegister, authController.register);
router.post("/login", authLimiter, validateLogin, authController.login);
router.get("/me", requireAuth, authController.getMe);
router.get("/users", requireAdmin, authController.getAllUsers);
router.put("/users/:userId/role", requireAdmin, validateUserRole, authController.updateUserRole);
router.patch("/users/:userId/role", requireAdmin, validateUserRole, authController.updateUserRole);
router.put("/users/:userId/status", requireAdmin, validateUserStatus, authController.updateUserStatus);
router.patch("/users/:userId/status", requireAdmin, validateUserStatus, authController.updateUserStatus);
router.get("/metrics", requireAdmin, authController.getAdminMetrics);

export default router;
