import { Router } from "express";
import {
  getPublicSpace,
  getPublicSpaceCategories,
  createPublicReport,
  getPublicTask,
  completePublicTask,
} from "./public.service.js";
import {
  publicSpaceIdValidation,
  publicReportValidation,
  publicTaskTokenValidation,
  publicCompleteTaskValidation,
} from "./public.validation.js";
import {
  upload,
  optionalReportImages,
  optionalCompletionImages,
} from "./public.upload.js";

const router = Router();

// Scan space QR → open space + report issue
router.get(
  "/spaces/:publicId",
  publicSpaceIdValidation,
  getPublicSpace,
);

router.get(
  "/spaces/:publicId/categories",
  publicSpaceIdValidation,
  getPublicSpaceCategories,
);

router.post(
  "/spaces/:publicId/reports",
  upload.array("images", 5),
  optionalReportImages,
  publicReportValidation,
  createPublicReport,
);

// Technician public task view + complete with images
router.get(
  "/tasks/:publicToken",
  publicTaskTokenValidation,
  getPublicTask,
);

router.post(
  "/tasks/:publicToken/complete",
  upload.array("images", 5),
  optionalCompletionImages,
  publicCompleteTaskValidation,
  completePublicTask,
);

export default router;
