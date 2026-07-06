import express from "express";
import { createTenant, getAllUsersOfTenant, getUserTenant } from "./tenant.service.js";
import { createTenantValidation } from "./tenant.validation.js";
import protectedRoutes from "../../middleware/protectedRoutes.js";
import { allowTo } from "../../middleware/allowTo.js";

const router = express.Router();
router.use(protectedRoutes , allowTo("admin" , "user" , "Owner"));
router.route("/").post(createTenantValidation, createTenant).get(getAllUsersOfTenant);

router.route("/user-tenant").get(getUserTenant);

export default router;
