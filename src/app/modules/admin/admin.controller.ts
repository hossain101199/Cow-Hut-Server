import { RequestHandler } from 'express';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
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
  const loginData = req.body;

  const result = await adminService.loginAdmin(loginData);

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

const getProfile: RequestHandler = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }

  const result = await adminService.getProfileFromDB(token);

  if (result === null) {
    throw new ApiError(401, `Invalid token`);
  } else {
    sendResponse<IAdmin>(res, {
      statusCode: 200,
      success: true,
      message: `Admin's information retrieved successfully`,
      data: result,
    });
  }
});

const updateProfile: RequestHandler = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }
  const updatedData = req.body;

  const result = await adminService.updateProfileInDB(token, updatedData);

  if (result === null) {
    throw new ApiError(401, `Invalid token`);
  } else {
    sendResponse<IAdmin>(res, {
      statusCode: 200,
      success: true,
      message: "Admin's information updated successfully",
      data: result,
    });
  }
});

export const adminController = {
  createAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
};
