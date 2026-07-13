import { Router } from "express";
import { createTask, getAllTasks, getTask, updateTask, deleteTask } from "./task.service.js";
import protectedRoutes from "../../middleware/protectedRoutes.js";
import { allowTo } from "../../middleware/allowTo.js";
import ignoreFields from "../../handler/ignoreFields.js";
import {
  createTaskValidation,
  updateTaskValidation,
  checkTaskIdValidation,
} from "./task.validation.js";

const router = Router();

router
  .route("/")
  .post(protectedRoutes, allowTo("Owner", "Admin"), createTaskValidation, createTask)
  .get(protectedRoutes, getAllTasks);

router
  .route("/:id")
  .get(protectedRoutes, allowTo("Owner", "Admin"), checkTaskIdValidation, getTask)
  .put(protectedRoutes, allowTo("Owner", "Admin"), ignoreFields, updateTaskValidation, updateTask)
  .delete(protectedRoutes, allowTo("Owner", "Admin"), checkTaskIdValidation, deleteTask);

export default router;
