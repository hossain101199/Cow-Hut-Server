import express from 'express';

import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import verifySeller from '../../middlewares/verifySeller';
import { cowController } from './cow.controller';
const router = express.Router();

router.post('/', auth(ENUM_USER_ROLE.SELLER), cowController.createCow);

router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.BUYER
  ),
  cowController.getSingleCow
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER),
  verifySeller,
  cowController.updateCow
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER),
  verifySeller,
  cowController.deleteCow
);

router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.BUYER
  ),
  cowController.getAllCows
);

export const cowRoutes = router;
