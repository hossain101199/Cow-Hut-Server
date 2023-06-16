import express from 'express';
import { cowController } from './cow.controller';
const router = express.Router();

router.post('/', cowController.createCow);

export const cowRoutes = router;
