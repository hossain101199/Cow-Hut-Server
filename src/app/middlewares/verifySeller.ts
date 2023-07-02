import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

import config from '../../config';
import ApiError from '../../errors/ApiError';
import { Cow } from '../modules/cow/cow.model';

const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError(401, 'Unauthorized: No token provided');
    }

    // Verify the token using the jwt.verify function
    const verifiedToken = jwt.verify(
      token,
      config.jwt.secret as Secret
    ) as JwtPayload;
    // Retrieve the cow ID from the request parameters
    const { id } = req.params;

    // // Find the cow by ID
    // const cow = await Cow.findById(id);
    const cow = await Cow.findOne({ _id: id, seller: verifiedToken.id });

    // // Check if the authenticated user ID is not equal to the seller ID of the cow
    // if (verifiedToken.id !== cow?.seller.toString()) {
    //   throw new ApiError(403, 'You are not authorized to perform this action');
    // }
    console.log(cow);
    if (!cow) {
      throw new ApiError(403, 'You are not authorized to perform this action');
    }

    // If the user is authorized, call the next middleware or route handler
    next();
  } catch (error) {
    // Handle any errors that occur during verification
    next(error);
  }
};

export default verifySeller;
