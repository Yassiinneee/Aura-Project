import { Router } from "express";
import * as paymentController from "../controllers/paymentController.js";

const router = Router();

router.post("/simulate", paymentController.simulatePayment);
router.post("/webhook", paymentController.handleWebhook);

export default router;
