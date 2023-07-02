import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';

import config from '../../../config';
import { cowSearchableFields } from './cow.constant';
import { ICow, ICowFilters } from './cow.interface';
import { Cow } from './cow.model';

const createCowInDB = async (token: string, payload: ICow): Promise<ICow> => {
  const verifiedToken = jwt.verify(
    token,
    config.jwt.secret as Secret
  ) as JwtPayload;

  payload.seller = verifiedToken.id;

  const createdCow = (await Cow.create(payload)).populate('seller');
  return createdCow;
};

const getSingleCowFromDB = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id).populate('seller');
  return result;
};

const updateCowInDB = async (
  token: string,
  id: string,
  payload: ICow
): Promise<ICow | null> => {
  const verifiedToken = jwt.verify(
    token,
    config.jwt.secret as Secret
  ) as JwtPayload;

  if (payload.seller) {
    payload.seller = verifiedToken.id;
  }

  const result = await Cow.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('seller');

  return result;
};

const deleteCowFromDB = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findByIdAndDelete(id).populate('seller');
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

  const result = await Cow.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate('seller');

  const total = await Cow.countDocuments(whereConditions).limit(limit);
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
