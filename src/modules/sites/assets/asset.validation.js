import { validationMiddleWare } from "../../../middleware/validation.js";
import { param, check } from "express-validator";
import SiteModel from "../sites.model.js";
import SpaceModel from "../spaces/space.model.js";
import AssetModel from "./asset.model.js";

export const createAssetValidation = [
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
      const asset = await AssetModel.findOne({
        tenantId: req.user.tenantId,
        siteId: req.params.siteId,
        code: values,
      });

      if (asset) {
        throw new Error("Code already exists");
      }

      return true;
    }),
  check("assetType")
    .optional()
    .isIn([
      "equipment",
      "hvac",
      "electrical",
      "plumbing",
      "furniture",
      "vehicle",
      "other",
    ])
    .withMessage("Invalid asset type"),
  check("status")
    .optional()
    .isIn(["active", "maintenance", "retired"])
    .withMessage("Status must be active, maintenance or retired"),
  check("spaceId")
    .optional({ values: "falsy" })
    .isMongoId()
    .withMessage("Invalid space ID")
    .custom((value, { req }) => {
      return SpaceModel.findOne({
        _id: value,
        tenantId: req.user.tenantId,
        siteId: req.params.siteId,
      }).then((space) => {
        if (!space) {
          return Promise.reject("Space not found");
        }
      });
    }),
  check("serialNumber").optional().isString(),

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

export const checkAssetIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("Asset ID is required")
    .isMongoId()
    .withMessage("Invalid asset ID")
    .custom((value, { req }) => {
      return AssetModel.findOne({
        _id: value,
        tenantId: req.user.tenantId,
        siteId: req.params.siteId,
      }).then((asset) => {
        if (!asset) {
          return Promise.reject("Asset not found");
        }
      });
    }),
  checkSiteIdValidation,
  validationMiddleWare,
];
