// http application
// import ApiError from "./utils/ApiErrors.js";
import express from "express";
import userRouter from "./modules/users/user.route.js";
import tenantRouter from "./modules/tenants/tenant.route.js";
import authRouter from "./modules/auth/auth.route.js";
import siteRouter from "./modules/sites/sites.route.js";
import spaceRouter from "./modules/sites/spaces/space.route.js";
import taskRouter from "./modules/tasks/task.route.js";
import publicRouter from "./modules/public/public.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import categoryRouter from "./modules/categories/category.route.js";
import cors from "cors";
const app = express();
app.use(cors());
// app.use(ApiError);
app.use(express.json());

// to make uploads folder public
app.use("/uploads" , express.static("uploads"))
// app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tenants", tenantRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/sites", siteRouter);
app.use("/api/v1/:siteId/spaces", spaceRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/public", publicRouter);

app.use(errorMiddleware);
// registerRoutes(app);

export default app;
