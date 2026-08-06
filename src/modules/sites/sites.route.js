import { Router } from "express";
import protectedRoutes from "../../middleware/protectedRoutes.js";
import { createSite, getSites, getSiteById, updateSite, deleteSite } from "./sites.service.js";
import { createSiteValidation, updateSiteValidation } from "./sites.validation.js";
import { upload, imageProcessor } from "./sites.upload.js";

const router = Router();
router.use(protectedRoutes);
router
  .route("/")
  .post(upload.single("image"), imageProcessor, createSiteValidation, createSite)
  .get(getSites);
router.route("/:id").get(getSiteById).put(updateSiteValidation, updateSite).delete(deleteSite);
export default router;