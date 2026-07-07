// http application

import express from "express";
import userRouter from "./modules/users/user.route.js";
import tenantRouter from "./modules/tenants/tenant.route.js";
import authRouter from "./modules/auth/auth.route.js";
import siteRouter from "./modules/sites/sites.route.js";
// import registerRoutes from './routes/index';
const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tenants", tenantRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/sites", siteRouter);

// registerRoutes(app);

export default app;
