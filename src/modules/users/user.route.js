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
router.use(protectedRoutes);
router.route("/").post( allowTo("Owner", "Admin"), createUser).get( allowTo("Owner", "Admin"), getUsers);

router
  .route("/me")
  .get( getMe)
  .put( updateMe);

router.route("/:id").get( getUserById).put( allowTo("Owner", "Admin"), updateUser).delete( allowTo("Owner", "Admin"), deleteUser);
export default router;
