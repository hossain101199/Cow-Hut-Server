import express from 'express';
import { adminController } from './admin.controller';

const router = express.Router();

router.post('/create-admin', adminController.createAdmin);

router.post('/login', adminController.loginAdmin);

router.get('/my-profile', adminController.getProfile);

router.patch('/my-profile', adminController.updateProfile);

export const adminRoutes = router;
