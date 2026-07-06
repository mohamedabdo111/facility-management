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

const router = express.Router();
router.use(protectedRoutes, allowTo("Owner", "Admin"));
router.route("/").post(createUser).get(getUsers);

router
  .route("/me")
  .get(getMe)
  .put(allowTo("Owner", "Admin", "Technician"), updateMe);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
export default router;
