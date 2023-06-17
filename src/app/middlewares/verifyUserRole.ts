// Import the necessary modules and types
import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import { user } from '../modules/user/user.model';

// Middleware function
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.seller;

    // user from the database
    const seller = await user.findById(userId);

    if (!seller) {
      // User not found
      throw new ApiError(
        404,
        `Error: User with ID ${userId} is not found. Please verify the provided ID and try again`
      );
    }

    // Check the user's role
    if (seller?.role === 'seller') {
      // User is a buyer or seller
      next();
    } else {
      // User role is not valid
      throw new ApiError(403, `Error: Invalid user role`);
    }
  } catch (error) {
    // Handle errors
    next(error);
  }
};
