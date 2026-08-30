import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import { validateCategory } from "../middlewares/validators.js";

const router = Router();

router.get("/", categoryController.getAllCategories);
router.get("/:slugOrId", categoryController.getCategoryBySlugOrId);
router.post("/", requireAdmin, validateCategory, categoryController.createCategory);
router.put("/:id", requireAdmin, validateCategory, categoryController.updateCategory);
router.delete("/:id", requireAdmin, categoryController.deleteCategory);

export default router;
