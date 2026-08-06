import { body, param } from "express-validator";
import { validationMiddleWare } from "../../middleware/validation.js";

export const publicSpaceIdValidation = [
  param("publicId").notEmpty().withMessage("Public space ID is required"),
  validationMiddleWare,
];

export const publicReportValidation = [
  param("publicId").notEmpty().withMessage("Public space ID is required"),
  // Use body() — check() also reads HTTP headers, and browsers send Priority: u=1, i
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),
  body("priority")
    .optional({ values: "falsy" })
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium or high"),
  body("reporterName").optional({ values: "falsy" }).isString(),
  body("name").optional({ values: "falsy" }).isString(),
  body("reporterContact").optional({ values: "falsy" }).isString(),
  body("phone").optional({ values: "falsy" }).isString(),
  validationMiddleWare,
];

export const publicTaskTokenValidation = [
  param("publicToken").notEmpty().withMessage("Public task token is required"),
  validationMiddleWare,
];

export const publicCompleteTaskValidation = [
  param("publicToken").notEmpty().withMessage("Public task token is required"),
  body("completionNotes").optional({ values: "falsy" }).isString(),
  body("technicianName").optional({ values: "falsy" }).isString(),
  validationMiddleWare,
];
