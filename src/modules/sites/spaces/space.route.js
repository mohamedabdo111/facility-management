import { Router } from "express";
import { createSpace } from "./space.service.js";
import protectedRoutes from "../../../middleware/protectedRoutes.js";
import { allowTo } from "../../../middleware/allowTo.js";
import {
  getSpaces,
  updateSpace,
  deleteSpace,
  getSpaceById,
} from "./space.service.js";
import {
  createSpaceValidation,
  checkSpaceIdValidation,
  checkSiteIdValidation,
} from "./space.validation.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    protectedRoutes,
    allowTo("Admin", "Owner", "Manager"),
    createSpaceValidation,
    createSpace,
  )
  .get(
    protectedRoutes,
    allowTo("Admin", "Owner", "Manager", "Technician"),
    checkSiteIdValidation,
    getSpaces,
  );

router
  .route("/:id")
  .get(
    protectedRoutes,
    allowTo("Admin", "Owner", "Manager", "Technician"),
    getSpaceById,
  )
  .delete(
    protectedRoutes,
    allowTo("Admin", "Owner", "Manager"),
    checkSpaceIdValidation,
    deleteSpace,
  )
  .put(
    protectedRoutes,
    allowTo("Admin", "Owner", "Manager"),
    checkSpaceIdValidation,
    updateSpace,
  );

export default router;
