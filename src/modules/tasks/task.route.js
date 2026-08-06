import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  completeTask,
} from "./task.service.js";
import protectedRoutes from "../../middleware/protectedRoutes.js";
import { allowTo } from "../../middleware/allowTo.js";
import ignoreFields from "../../handler/ignoreFields.js";
import {
  createTaskValidation,
  updateTaskValidation,
  checkTaskIdValidation,
} from "./task.validation.js";
import { upload, imageProcessor } from "./task.upload.js";
import {
  upload as publicUpload,
  optionalCompletionImages,
} from "../public/public.upload.js";

const router = Router();

router
  .route("/")
  .post(
    protectedRoutes,
    allowTo("Owner", "Admin"),
    upload.array("images"),
    imageProcessor,
    createTaskValidation,
    createTask,
  )
  .get(protectedRoutes, getAllTasks);

router.post(
  "/:id/complete",
  protectedRoutes,
  allowTo("Owner", "Admin", "Supervisor", "Technician"),
  publicUpload.array("images", 5),
  optionalCompletionImages,
  checkTaskIdValidation,
  completeTask,
);

router
  .route("/:id")
  .get(
    protectedRoutes,
    allowTo("Owner", "Admin", "Supervisor", "Technician"),
    checkTaskIdValidation,
    getTask,
  )
  .put(protectedRoutes, allowTo("Owner", "Admin"), ignoreFields, updateTaskValidation, updateTask)
  .delete(protectedRoutes, allowTo("Owner", "Admin"), checkTaskIdValidation, deleteTask);

export default router;
