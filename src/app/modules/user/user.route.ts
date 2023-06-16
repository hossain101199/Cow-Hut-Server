import express from 'express';
import { userController } from './user.controller';
const router = express.Router();

router.get('/:id', userController.getSingleUser);

router.patch('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

router.get('/', userController.getAllUsers);

export const userRoutes = router;
