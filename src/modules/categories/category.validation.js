import { check } from "express-validator";
import { validationMiddleWare } from "../../middleware/validation.js";

export const createCategoryValidation = [
    check("name").notEmpty().withMessage("Category name is required"),
    validationMiddleWare,
];