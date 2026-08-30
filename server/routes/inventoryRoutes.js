import { Router } from "express";
import * as inventoryController from "../controllers/inventoryController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import { validateInventoryAdjust } from "../middlewares/validators.js";

const router = Router();

router.get("/summary", requireAdmin, inventoryController.getInventorySummary);
router.get("/low-stock", requireAdmin, inventoryController.getLowStock);
router.get("/stock-movements", requireAdmin, inventoryController.getStockMovements);
router.get("/movements", requireAdmin, inventoryController.getStockMovements);
router.post("/adjust", requireAdmin, validateInventoryAdjust, inventoryController.adjustStock);

export default router;
