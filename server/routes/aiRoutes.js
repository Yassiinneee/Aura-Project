import { Router } from "express";
import * as aiController from "../controllers/aiController.js";
import { aiChatLimiter } from "../middlewares/rateLimiter.js";
import { validateAiChat } from "../middlewares/validators.js";

const router = Router();

router.post("/chat", aiChatLimiter, validateAiChat, aiController.chatConcierge);

export default router;
