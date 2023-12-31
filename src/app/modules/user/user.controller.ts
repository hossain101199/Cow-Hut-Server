import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { userFilterableFields } from './user.constant';
import { IUser } from './user.interface';
import { userService } from './user.service';

const getProfile: RequestHandler = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }

  const result = await userService.getProfileFromDB(token);
  if (result === null) {
    throw new ApiError(401, `Invalid token`);
  } else {
    sendResponse<IUser>(res, {
      statusCode: 200,
      success: true,
      message: `User's information retrieved successfully`,
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

  const result = await userService.updateProfileInDB(token, updatedData);

  if (result === null) {
    throw new ApiError(401, `Invalid token`);
  } else {
    sendResponse<IUser>(res, {
      statusCode: 200,
      success: true,
      message: "User's information Updated successfully",
      data: result,
    });
  }
});

const getSingleUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.getSingleUserFromDB(id);

  if (result === null) {
    throw new ApiError(
      404,
      `Error: User with ID ${id} is not found. Please verify the provided ID and try again`
    );
  } else {
    sendResponse<IUser>(res, {
      statusCode: 200,
      success: true,
      message: 'User retrieved successfully',
      data: result,
    });
  }
});

const updateUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await userService.updateUserInDB(id, updatedData);

  if (result === null) {
    throw new ApiError(
      404,
      `Error: User with ID ${id} is not found. Please verify the provided ID and try again`
    );
  } else {
    sendResponse<IUser>(res, {
      statusCode: 200,
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  }
});

const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.deleteUserFromDB(id);

  if (result === null) {
    throw new ApiError(
      404,
      `Error: User with ID ${id} is not found. Please verify the provided ID and try again`
    );
  } else {
    sendResponse<IUser>(res, {
      statusCode: 200,
      success: true,
      message: 'User deleted successfully',
      data: result,
    });
  }
});

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);

  const paginationOptions = pick(req.query, paginationFields);

  const result = await userService.getAllUsersFromDB(
    filters,
    paginationOptions
  );

  sendResponse<IUser[]>(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const userController = {
  getProfile,
  updateProfile,
  getSingleUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
