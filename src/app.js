// http application

import express from 'express';
import userRouter from './modules/users/user.route.js';
import tanantRouter from './modules/tanants/tanant.route.js';
// import registerRoutes from './routes/index';
const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tanants', tanantRouter);


// registerRoutes(app);

export default app;