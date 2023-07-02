import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import verifyOrderOwnership from '../../middlewares/verifyOrderOwnership';
import { orderController } from './order.controller';

const router = express.Router();

router.post('/', auth(ENUM_USER_ROLE.BUYER), orderController.createOrder);

router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.BUYER
  ),
  verifyOrderOwnership,
  orderController.getSingleOrder
);

router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.BUYER
  ),
  orderController.getAllOrders
);

export const orderRoutes = router;
