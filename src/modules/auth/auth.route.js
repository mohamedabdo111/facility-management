import { Router } from "express";
import { loginValidation } from "./auth.validation.js";
import { login } from "./auth.service.js";

const router = Router();

router.post("/login", loginValidation, login);

export default router;
