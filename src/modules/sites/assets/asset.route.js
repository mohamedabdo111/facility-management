import { Router } from "express";
import {
  createAsset,
  getAssets,
  updateAsset,
  deleteAsset,
  getAssetById,
} from "./asset.service.js";
import protectedRoutes from "../../../middleware/protectedRoutes.js";
import { allowTo } from "../../../middleware/allowTo.js";
import {
  createAssetValidation,
  checkAssetIdValidation,
  checkSiteIdValidation,
} from "./asset.validation.js";
import { upload, imageProcessor } from "./asset.upload.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    protectedRoutes,
    allowTo("Admin", "Owner", "Manager"),
    upload.single("image"),
    imageProcessor,
    createAssetValidation,
    createAsset,
  )
  .get(
    protectedRoutes,
    allowTo("Admin", "Owner", "Manager", "Technician"),
    checkSiteIdValidation,
    getAssets,
  );

router
  .route("/:id")
  .get(
    protectedRoutes,
    allowTo("Admin", "Owner", "Manager", "Technician"),
    getAssetById,
  )
  .delete(
    protectedRoutes,
    allowTo("Admin", "Owner", "Manager"),
    checkAssetIdValidation,
    deleteAsset,
  )
  .put(
    protectedRoutes,
    allowTo("Admin", "Owner", "Manager"),
    checkAssetIdValidation,
    updateAsset,
  );

export default router;
