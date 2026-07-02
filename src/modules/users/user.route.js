import express from 'express';
import createUser from './user.service.js';

const router = express.Router();

router.post('/', createUser);

export default router;