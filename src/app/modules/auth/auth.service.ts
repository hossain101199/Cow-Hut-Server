import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { ILogin, ILoginUserResponse } from '../../../interfaces/common';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const createUserInDB = async (payload: IUser): Promise<IUser> => {
  if (payload.role == 'seller') {
    payload.budget = 0;
    payload.income = 0;
  }

  if (payload.role == 'buyer') {
    payload.income = 0;
  }

  const createdUser = await User.create(payload);
  return createdUser;
};

const loginUser = async (payload: ILogin): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;

  const isUserExist = await User.findOne(
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
    throw new ApiError(404, 'User does not exist');
  }
};
export const authService = {
  createUserInDB,
  loginUser,
};
