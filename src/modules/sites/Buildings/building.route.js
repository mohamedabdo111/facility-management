import { Router } from "express";
import { createBuilding } from "./building.service.js";
import protectedRoutes from "../../../middleware/protectedRoutes.js";
import { allowTo } from "../../../middleware/allowTo.js";
import {
  getBuildings,
  updateBuilding,
  deleteBuilding,
  getBuildingById,
} from "./building.service.js";
import { createBuildingValidation, checkBuildingIdValidation, checkSiteIdValidation } from "./building.validation.js";

const router = Router({mergeParams: true});

router
  .route("/")
  .post(
    protectedRoutes,
    allowTo("Admin", "Owner", "Manager"),
    createBuildingValidation,
    createBuilding,
  )
  .get(protectedRoutes, allowTo("Admin", "Owner", "Manager" , "Technician"), checkSiteIdValidation, getBuildings)

router
  .route("/:id")
  .get(protectedRoutes, allowTo("Admin", "Owner", "Manager" , "Technician"),checkBuildingIdValidation, getBuildingById)
  .delete(protectedRoutes, allowTo("Admin", "Owner", "Manager"),checkBuildingIdValidation, deleteBuilding)
  .put(protectedRoutes, allowTo("Admin", "Owner", "Manager"),checkBuildingIdValidation ,updateBuilding);

export default router;
