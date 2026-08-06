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
  // Optional — defaults to medium in the service
  check("priority")
    .optional({ values: "falsy" })
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium or high"),
  // Optional reporter fields (name / phone aliases supported)
  check("reporterName").optional({ values: "falsy" }).isString(),
  check("name").optional({ values: "falsy" }).isString(),
  check("reporterContact").optional({ values: "falsy" }).isString(),
  check("phone").optional({ values: "falsy" }).isString(),
  validationMiddleWare,
];

export const publicTaskTokenValidation = [
  param("publicToken").notEmpty().withMessage("Public task token is required"),
  validationMiddleWare,
];

export const publicCompleteTaskValidation = [
  param("publicToken").notEmpty().withMessage("Public task token is required"),
  check("completionNotes").optional({ values: "falsy" }).isString(),
  check("technicianName").optional({ values: "falsy" }).isString(),
  validationMiddleWare,
];
