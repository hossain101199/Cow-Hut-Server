import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { ILogin, ILoginUserResponse } from '../../../interfaces/common';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdminInDB = async (payload: IAdmin): Promise<IAdmin> => {
  const createdAdmin = await Admin.create(payload);
  return createdAdmin;
};

const loginAdmin = async (payload: ILogin): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;

  const isUserExist = await Admin.findOne(
    { phoneNumber },
    { id: 1, role: 1, password: 1 }
  );

  if (isUserExist) {
    if (await bcrypt.compare(password, isUserExist.password)) {
      const { id, role } = isUserExist;

      const accessToken = jwt.sign(
        {
          id,
          role,
        },
        config.jwt.secret as Secret,
        { expiresIn: config.jwt.expires_in }
      );

      const refreshToken = jwt.sign(
        {
          id,
          role,
        },
        config.jwt.refresh_secret as Secret,
        { expiresIn: config.jwt.refresh_expires_in }
      );

      return {
        accessToken,
        refreshToken,
      };
    } else {
      throw new ApiError(401, 'Password is incorrect');
    }
  } else {
    throw new ApiError(404, 'Admin does not exist');
  }
};

export const adminService = {
  createAdminInDB,
  loginAdmin,
};
