import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { user } from '../user/user.model';
import { cowSearchableFields } from './cow.constant';
import { ICow, ICowFilters } from './cow.interface';
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

  if (userId) {
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
    if (seller.role !== 'seller') {
      // User is a buyer or seller
      throw new ApiError(403, `Error: Invalid user role`);
    }
  }

  const result = await cow
    .findByIdAndUpdate(id, payload, {
      new: true,
    })
    .populate('seller');
  return result;
};

const deleteCowFromDB = async (id: string): Promise<ICow | null> => {
  const result = await cow.findByIdAndDelete(id).populate('seller');
  return result;
};

const getAllCowsFromDB = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (minPrice && maxPrice) {
    andConditions.push({
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    });
  } else if (minPrice) {
    andConditions.push({
      price: {
        $gte: minPrice,
      },
    });
  } else if (maxPrice) {
    andConditions.push({
      price: {
        $lte: maxPrice,
      },
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await cow
    .find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate('seller');

  const total = await cow.countDocuments(whereConditions).limit(limit);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const cowService = {
  createCowInDB,
  getSingleCowFromDB,
  updateCowInDB,
  deleteCowFromDB,
  getAllCowsFromDB,
};
