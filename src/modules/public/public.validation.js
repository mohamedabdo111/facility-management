import { check, param } from "express-validator";
import { validationMiddleWare } from "../../middleware/validation.js";

export const publicSpaceIdValidation = [
  param("publicId").notEmpty().withMessage("Public space ID is required"),
  validationMiddleWare,
];

export const publicReportValidation = [
  param("publicId").notEmpty().withMessage("Public space ID is required"),
  check("title").notEmpty().withMessage("Title is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),
  check("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium or high"),
  check("reporterName").optional().isString(),
  check("reporterContact").optional().isString(),
  validationMiddleWare,
];

export const publicTaskTokenValidation = [
  param("publicToken").notEmpty().withMessage("Public task token is required"),
  validationMiddleWare,
];

export const publicCompleteTaskValidation = [
  param("publicToken").notEmpty().withMessage("Public task token is required"),
  check("completionNotes").optional().isString(),
  check("technicianName").optional().isString(),
  validationMiddleWare,
];
