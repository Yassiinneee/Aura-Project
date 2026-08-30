import { Router } from "express";
import * as deliveryController from "../controllers/deliveryController.js";

const router = Router();

router.get("/delivery-options", deliveryController.getDeliveryOptions);

export default router;
