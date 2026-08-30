import { Router } from "express";
import * as emailController from "../controllers/emailController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/logs", requireAdmin, emailController.getEmailLogs);
router.post("/:emailId/retry", requireAdmin, emailController.retryEmailDelivery);

export default router;
