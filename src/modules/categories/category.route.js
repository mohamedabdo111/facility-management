import { Router } from "express";
import { createCategory, getAllCategories, getCategory, updateCategory } from "./category.service.js";
import protectedRoutes from "../../middleware/protectedRoutes.js";
import { allowTo } from "../../middleware/allowTo.js";
import { createCategoryValidation } from "./category.validation.js";

const router = Router();

router.route("/").post(protectedRoutes , allowTo("Owner", "Admin"), createCategoryValidation, createCategory).get(protectedRoutes , allowTo("Owner", "Admin"), getAllCategories);
router.route("/:id").get(protectedRoutes , allowTo("Owner", "Admin"), getCategory).put(protectedRoutes , allowTo("Owner", "Admin"), updateCategory);
export default router;