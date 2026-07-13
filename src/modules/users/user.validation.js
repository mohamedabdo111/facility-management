import { check, param } from "express-validator";
import { validationMiddleWare } from "../../middleware/validation.js";
import UserModel from "./user.model.js";

export const createUserValidation = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value) => {
      const existUser = await UserModel.findOne({ email: value });
      if (existUser) {
        return Promise.reject("Email already exists");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  check("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["Owner", "Admin", "Technician", "Supervisor"])
    .withMessage("Invalid role"),
  validationMiddleWare,
];

export const updateUserValidation = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value, { req }) => {
      const existUser = await UserModel.findOne({
        email: value,
        _id: { $ne: req.params.id },
      });
      if (existUser) {
        return Promise.reject("Email already exists");
      }
      return true;
    }),
  check("role")
    .optional()
    .isIn(["Owner", "Admin", "Technician", "Supervisor"])
    .withMessage("Invalid role"),
  validationMiddleWare,
];

export const updateMeValidation = [
  check("name").optional().notEmpty().withMessage("Name is required"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value, { req }) => {
      const existUser = await UserModel.findOne({
        email: value,
        _id: { $ne: req.user._id },
      });
      if (existUser) {
        return Promise.reject("Email already exists");
      }
      return true;
    }),
  validationMiddleWare,
];

export const checkUserIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID")
    .custom((value, { req }) => {
      return UserModel.findOne({
        _id: value,
        tenantId: req.user.tenantId,
      }).then((user) => {
        if (!user) {
          return Promise.reject("User not found");
        }
      });
    }),
  validationMiddleWare,
];
