import { Router } from "express";
import * as auditController from "../controllers/auditController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/logs", requireAdmin, auditController.getAuditLogsController);
router.get("/export", requireAdmin, auditController.exportAuditLogs);
router.get("/health", auditController.getTelemetryHealth);

export default router;
