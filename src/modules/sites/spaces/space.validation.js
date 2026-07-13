import { validationMiddleWare } from "../../../middleware/validation.js";
import { param, check } from "express-validator";
import SiteModel from "../sites.model.js";
import SpaceModel from "./space.model.js";
import ApiError from "../../../utils/ApiErrors.js";

export const createSpaceValidation = [
  param("siteId")
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
          throw new Error("Site not found");
        }
      });
    }),
  check("name").notEmpty().withMessage("Name is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("code")
    .notEmpty()
    .withMessage("Code is required")
    .custom(async (values, { req }) => {
      const space = await SpaceModel.findOne({
        tenantId: req.user.tenantId,
        siteId: req.params.siteId,
        code: values,
      });

      if (space) {
        throw new Error("Code already exists");
      }

      return true;
    }),

  validationMiddleWare,
];

export const checkSiteIdValidation = [
  param("siteId")
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

  validationMiddleWare,
];

export const checkSpaceIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("Space ID is required")
    .isMongoId()
    .withMessage("Invalid space ID")
    .custom((value, { req }) => {
      return SpaceModel.findOne({
        _id: value,
        tenantId: req.user.tenantId,
      }).then((space) => {
        if (!space) {
          return Promise.reject("Space not found");
        }
      });
    }),
  checkSiteIdValidation,
  validationMiddleWare,
];
