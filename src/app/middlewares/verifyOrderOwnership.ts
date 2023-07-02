import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../config';
import { ENUM_USER_ROLE } from '../../enums/user';
import ApiError from '../../errors/ApiError';
import { ICow } from '../modules/cow/cow.interface';
import { Order } from '../modules/order/order.model';
import { IUser } from '../modules/user/user.interface';

const verifyOrderOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization;
  const { id } = req.params;
  try {
    if (!token) {
      throw new ApiError(401, 'Unauthorized: No token provided');
    }

    // Verify the token using the jwt.verify function
    const verifiedToken = jwt.verify(
      token,
      config.jwt.secret as Secret
    ) as JwtPayload;

    const order = await Order.findById(id).populate([
      { path: 'cow', populate: { path: 'seller' } },
      { path: 'buyer' },
    ]);

    if (!order) {
      throw new Error(`Order with ID ${id} is not found.`);
    }

    const cow = order.cow as ICow;
    const buyer = order.buyer as IUser;

    if (
      (verifiedToken.role === ENUM_USER_ROLE.SELLER &&
        cow.seller._id?.toString() !== verifiedToken.id) ||
      (verifiedToken.role === ENUM_USER_ROLE.BUYER &&
        buyer._id?.toString() !== verifiedToken.id)
    ) {
      throw new Error('You are not authorized to access this order.');
    }

    next();
  } catch (error) {
    // Handle any errors that occur during verification
    next(error);
  }
};

export default verifyOrderOwnership;
