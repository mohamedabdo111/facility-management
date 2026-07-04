import express from "express";
import { createTenant } from "./tenant.service.js";
import { createTenantValidation } from "./tenant.validation.js";

const router = express.Router();

router.route("/").post(createTenantValidation, createTenant);

export default router;
