import express from 'express';
import { verifyBuyer } from '../../middlewares/verifyBuyer';
import { orderController } from './order.controller';

const router = express.Router();

router.post('/', verifyBuyer, orderController.createOrder);

router.get('/:id');

router.patch('/:id');

router.delete('/:id');

router.get('/');

export const orderRoutes = router;
