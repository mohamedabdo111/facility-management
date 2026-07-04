import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./user.service.js";
import protectedRoutes from "../../middleware/protectedRoutes.js";
import { allowTo } from "../../middleware/allowTo.js";

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(protectedRoutes, allowTo("Owner", "Admin"), getUsers);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

export default router;
