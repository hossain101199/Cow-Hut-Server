import express from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { cowRoutes } from '../modules/cow/cow.route';
import { userRoutes } from '../modules/user/user.route';

const routes = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/cows',
    route: cowRoutes,
  },
];

moduleRoutes.forEach(route => routes.use(route.path, route.route));

export default routes;
