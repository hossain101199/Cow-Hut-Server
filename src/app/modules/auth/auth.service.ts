import bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import {
  ILogin,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../../../interfaces/common';
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

const refreshToken = async (
  payload: string
): Promise<IRefreshTokenResponse> => {
  // invalid token - synchronous
  let verifiedToken = null;

  try {
    verifiedToken = jwt.verify(
      payload,
      config.jwt.refresh_secret as Secret
    ) as JwtPayload;
  } catch (err) {
    throw new ApiError(403, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;

  const isUserExist = await User.findById(id, { id: 1, role: 1 });

  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }

  const newAccessToken = jwt.sign(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    { expiresIn: config.jwt.expires_in }
  );

  return {
    accessToken: newAccessToken,
  };
};
export const authService = {
  createUserInDB,
  loginUser,
  refreshToken,
};
