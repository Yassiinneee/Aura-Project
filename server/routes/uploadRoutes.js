import { Router } from "express";
import * as uploadController from "../controllers/uploadController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import { uploadLimiter } from "../middlewares/rateLimiter.js";
import { validateUpload } from "../middlewares/validators.js";

const router = Router();

router.post("/", requireAdmin, uploadLimiter, validateUpload, uploadController.uploadImage);

export default router;
