import { Router } from "express";
import protectedRoutes from "../../middleware/protectedRoutes.js";
import { createSite, getSites, getSiteById, updateSite, deleteSite } from "./sites.service.js";
import { createSiteValidation, updateSiteValidation } from "./sites.validation.js";

const router = Router();
router.use(protectedRoutes);
router.route("/").post(createSiteValidation, createSite).get(getSites);
router.route("/:id").get(getSiteById).put(updateSiteValidation, updateSite).delete(deleteSite);
export default router;