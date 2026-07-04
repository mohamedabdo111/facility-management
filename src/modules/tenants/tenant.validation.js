import { body } from "express-validator";
import { validationMiddleWare } from "../../middleware/validation.js";
import UserModel from "../users/user.model.js";

export const createTenantValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
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
  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number"),
  body("address").notEmpty().withMessage("Address is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validationMiddleWare,
];

export const updateTenantValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
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
  body("phone").isMobilePhone("ar-EG").withMessage("Invalid phone number"),
  body("address").notEmpty().withMessage("Address is required"),
  validationMiddleWare,
];
