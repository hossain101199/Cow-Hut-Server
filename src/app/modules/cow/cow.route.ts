import express from 'express';
import { verifySeller } from '../../middlewares/verifyUserRole';
import { cowController } from './cow.controller';
const router = express.Router();

router.post('/', verifySeller, cowController.createCow);

router.get('/:id', cowController.getSingleCow);

router.patch('/:id', cowController.updateCow);

// router.delete('/:id', cowController);

// router.get('/', cowController);

export const cowRoutes = router;
