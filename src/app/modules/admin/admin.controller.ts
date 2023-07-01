import { RequestHandler } from 'express';
import config from '../../../config';
import { ILoginUserResponse } from '../../../interfaces/common';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAdmin } from './admin.interface';
import { adminService } from './admin.service';

const createAdmin: RequestHandler = catchAsync(async (req, res) => {
  const admin = req.body;
  const result = await adminService.createAdminInDB(admin);

  sendResponse<IAdmin>(res, {
    statusCode: 200,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const loginAdmin: RequestHandler = catchAsync(async (req, res) => {
  const loginDAta = req.body;

  const result = await adminService.loginAdmin(loginDAta);

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
    message: 'Admin logging successfully!',
    data: accessToken,
  });
});

export const adminController = {
  createAdmin,
  loginAdmin,
};
