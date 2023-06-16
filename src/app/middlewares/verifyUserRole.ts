// Import the necessary modules and types
import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../shared/sendResponse';
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
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: `Error: User with ID ${req.body.seller} is not found. Please verify the provided ID and try again`,
      });
    }

    // Check the user's role
    if (seller?.role === 'seller') {
      // User is a buyer or seller
      next();
    } else {
      // User role is not valid
      sendResponse(res, {
        statusCode: 403,
        success: false,
        message: `Error: Invalid user role`,
      });
    }
  } catch (error) {
    // Handle errors
    next(error);
  }
};
