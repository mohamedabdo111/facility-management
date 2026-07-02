import express from 'express';
import { createTanant } from './tanant.service.js';

const router = express.Router();

router.route('/').post(createTanant);

export default router;