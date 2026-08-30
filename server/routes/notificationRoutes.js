import { Router } from "express";
import * as notificationController from "../controllers/notificationController.js";
import { optionalAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", optionalAuth, notificationController.getNotifications);
router.put("/:id/read", optionalAuth, notificationController.markNotificationAsRead);
router.patch("/:id/read", optionalAuth, notificationController.markNotificationAsRead);
router.post("/clear-all", optionalAuth, notificationController.clearAllNotifications);

export default router;
