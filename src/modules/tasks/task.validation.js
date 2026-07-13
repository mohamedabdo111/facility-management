import { check, param } from "express-validator";
import { validationMiddleWare } from "../../middleware/validation.js";
import SiteModel from "../sites/sites.model.js";
import SpaceModel from "../sites/spaces/space.model.js";
import CategoryModel from "../categories/category.model.js";
import UserModel from "../users/user.model.js";
import TaskModel from "./task.model.js";

export const createTaskValidation = [
  check("title").notEmpty().withMessage("Title is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("siteId")
    .notEmpty()
    .withMessage("Site ID is required")
    .isMongoId()
    .withMessage("Invalid site ID")
    .custom((value, { req }) => {
      return SiteModel.findOne({
        _id: value,
        tenantId: req.user.tenantId,
      }).then((site) => {
        if (!site) {
          return Promise.reject("Site not found");
        }
      });
    }),
  check("spaceId")
    .notEmpty()
    .withMessage("Space ID is required")
    .isMongoId()
    .withMessage("Invalid space ID")
    .custom((value, { req }) => {
      return SpaceModel.findOne({
        _id: value,
        tenantId: req.user.tenantId,
        siteId: req.body.siteId,
      }).then((space) => {
        if (!space) {
          return Promise.reject("Space not found");
        }
      });
    }),
  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID")
    .custom((value, { req }) => {
      return CategoryModel.findOne({
        _id: value,
        tenantId: req.user.tenantId,
      }).then((category) => {
        if (!category) {
          return Promise.reject("Category not found");
        }
      });
    }),
  check("createdBy")
    .notEmpty()
    .withMessage("Created by is required")
    .isMongoId()
    .withMessage("Invalid createdBy")
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
  check("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("Invalid assignedTo")
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
  check("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium or high"),
  check("status")
    .optional()
    .isIn(["pending", "in_progress", "completed", "cancelled"])
    .withMessage("Status must be pending, in_progress, completed or cancelled"),

  validationMiddleWare,
];

export const updateTaskValidation = [
  param("id")
    .notEmpty()
    .withMessage("Task ID is required")
    .isMongoId()
    .withMessage("Invalid task ID"),
  validationMiddleWare,
];

export const checkTaskIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("Task ID is required")
    .isMongoId()
    .withMessage("Invalid task ID")
    .custom((value, { req }) => {
      return TaskModel.findOne({
        _id: value,
        tenantId: req.user.tenantId,
      }).then((task) => {
        if (!task) {
          return Promise.reject("Task not found");
        }
      });
    }),
  validationMiddleWare,
];
