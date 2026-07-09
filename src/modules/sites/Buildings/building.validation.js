import { validationMiddleWare } from "../../../middleware/validation.js";
import { param, check } from "express-validator";
import SiteModel from "../sites.model.js";
import BuildingModel from "./building.modal.js";

export const createBuildingValidation = [
  param("siteId")
    .notEmpty()
    .withMessage("Site ID is required")
    .isMongoId()
    .withMessage("Invalid site ID")
    .custom((value , {req}) => {
      return SiteModel.findOne({
        _id: value,
        tenantId: req.user.tenantId,
        
      }).then((site) => {
        if (!site) {
          return Promise.reject("Site not found");
        }
      });
    }),
  check("name").notEmpty().withMessage("Name is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("code").notEmpty().withMessage("Code is required"),

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

export const checkBuildingIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("Building ID is required")
    .isMongoId()
    .withMessage("Invalid building ID")
    .custom((value, { req }) => {
      return BuildingModel.findOne({
        _id: value,
        tenantId: req.user.tenantId,
      }).then((building) => {
        if (!building) {
          return Promise.reject("Building not found");
        }
      });
    }),
  checkSiteIdValidation,
  validationMiddleWare,
];
