import express from 'express';
import { orderController } from './order.controller';

const router = express.Router();

router.post('/', orderController.createOrder);

router.get('/:id');

router.patch('/:id');

router.delete('/:id');

router.get('/');

export const orderRoutes = router;
