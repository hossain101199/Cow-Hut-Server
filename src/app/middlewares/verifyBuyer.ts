import { RequestHandler } from 'express';
import ApiError from '../../errors/ApiError';
import { cow as cowModel } from '../modules/cow/cow.model';
import { user } from '../modules/user/user.model';

export const verifyBuyer: RequestHandler = async (req, res, next) => {
  const { buyer } = req.body;
  const { cow } = req.body;

  try {
    const buyerUser = await user.findOne({ _id: buyer, role: 'buyer' });

    if (!buyerUser) {
      // User role is not valid
      throw new ApiError(400, `Error: Invalid buyer or insufficient role.`);
    }

    const availableCow = await cowModel.findOne({
      _id: cow,
      label: 'for sale',
    });

    if (!availableCow) {
      throw new ApiError(400, `Error: Invalid cow or not available for sale.`);
    }

    if (buyerUser.budget < availableCow.price) {
      throw new ApiError(400, `Error: Insufficient funds.`);
    }

    next();
  } catch (error) {
    next(error);
  }
};
