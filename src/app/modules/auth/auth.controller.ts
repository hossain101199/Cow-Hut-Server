import { RequestHandler } from 'express';
import config from '../../../config';
import { ILoginUserResponse } from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from '../user/user.interface';
import { authService } from './auth.service';

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const user = req.body;
  const result = await authService.createUserInDB(user);

  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const loginDAta = req.body;

  const result = await authService.loginUser(loginDAta);

  const { refreshToken, ...accessToken } = result;

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logging successfully!',
    data: accessToken,
  });
});

export const authController = {
  createUser,
  loginUser,
};
