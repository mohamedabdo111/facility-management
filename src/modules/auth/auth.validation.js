import { validationMiddleWare } from "../../middleware/validation.js";
import { body } from "express-validator";

export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
  validationMiddleWare,
];
