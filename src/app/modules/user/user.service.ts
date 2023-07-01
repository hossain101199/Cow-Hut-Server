import bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { userSearchableFields } from './user.constant';
import { IUser, IUserFilters } from './user.interface';
import { User } from './user.model';

const getProfileFromDB = async (payload: string): Promise<IUser | null> => {
  const verifiedToken = jwt.verify(
    payload,
    config.jwt.secret as Secret
  ) as JwtPayload;
  if (verifiedToken) {
    const result = await User.findById(verifiedToken.id);
    return result;
  } else {
    throw new ApiError(403, 'Forbidden');
  }
};

const updateProfileInDB = async (
  token: string,
  payload: IUser
): Promise<IUser | null> => {
  const verifiedToken = jwt.verify(
    token,
    config.jwt.secret as Secret
  ) as JwtPayload;
  const { name, password, ...userData } = payload;

  const updatedUserData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds)
    );
    updatedUserData.password = hashedPassword;
  }

  if (verifiedToken) {
    const result = await User.findByIdAndUpdate(
      verifiedToken.id,
      updatedUserData,
      {
        new: true,
      }
    );

    return result;
  } else {
    throw new ApiError(403, 'Forbidden');
  }
};

const getSingleUserFromDB = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const updateUserInDB = async (
  id: string,
  payload: IUser
): Promise<IUser | null> => {
  const { name, password, ...userData } = payload;

  const updatedUserData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds)
    );
    updatedUserData.password = hashedPassword;
  }

  const result = await User.findByIdAndUpdate(id, updatedUserData, {
    new: true,
  });
  return result;
};

const deleteUserFromDB = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

const getAllUsersFromDB = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
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

  const result = await User.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const userService = {
  getProfileFromDB,
  updateProfileInDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
  getAllUsersFromDB,
};
