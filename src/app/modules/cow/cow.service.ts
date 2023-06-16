import ApiError from '../../../errors/ApiError';
import { user } from '../user/user.model';
import { ICow } from './cow.interface';
import { cow } from './cow.model';

const createCowInDB = async (payload: ICow): Promise<ICow> => {
  const createdCow = (await cow.create(payload)).populate('seller');
  return createdCow;
};

const getSingleCowFromDB = async (id: string): Promise<ICow | null> => {
  const result = await cow.findById(id).populate('seller');
  return result;
};

const updateCowInDB = async (
  id: string,
  payload: ICow
): Promise<ICow | null> => {
  const userId = payload.seller;

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
  if (seller?.role !== 'seller') {
    // User is a buyer or seller
    throw new ApiError(403, `Error: Invalid user role`);
  }

  const result = await cow
    .findByIdAndUpdate(id, payload, {
      new: true,
    })
    .populate('seller');
  return result;
};

export const cowService = {
  createCowInDB,
  getSingleCowFromDB,
  updateCowInDB,
};
