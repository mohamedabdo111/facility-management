import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  getMe,
  updateMe,
} from "./user.service.js";
import protectedRoutes from "../../middleware/protectedRoutes.js";
import { allowTo } from "../../middleware/allowTo.js";
import {
  createUserValidation,
  updateUserValidation,
  updateMeValidation,
  checkUserIdValidation,
} from "./user.validation.js";
import { upload, imageProcessor } from "./user.upload.js";

const router = express.Router();
router.use(protectedRoutes);

router
  .route("/")
  .post(
    allowTo("Owner", "Admin"),
    upload.single("image"),
    imageProcessor,
    createUserValidation,
    createUser,
  )
  .get(allowTo("Owner", "Admin"), getUsers);

router.route("/me").get(getMe).put(updateMeValidation, updateMe);

router
  .route("/:id")
  .get(checkUserIdValidation, getUserById)
  .put(allowTo("Owner", "Admin"), updateUserValidation, updateUser)
  .delete(allowTo("Owner", "Admin"), checkUserIdValidation, deleteUser);

export default router;
