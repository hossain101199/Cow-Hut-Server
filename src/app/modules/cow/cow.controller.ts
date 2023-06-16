import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { cowFilterableFields } from './cow.constant';
import { ICow } from './cow.interface';
import { cowService } from './cow.service';

const createCow: RequestHandler = catchAsync(async (req, res) => {
  const cow = req.body;
  const result = await cowService.createCowInDB(cow);

  sendResponse<ICow>(res, {
    statusCode: 200,
    success: true,
    message: 'Cow created successfully',
    data: result,
  });
});

const getSingleCow: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await cowService.getSingleCowFromDB(id);

  if (result === null) {
    sendResponse<ICow>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Cow with ID ${id} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<ICow>(res, {
      statusCode: 200,
      success: true,
      message: 'Cow retrieved successfully',
      data: result,
    });
  }
});

const updateCow: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const result = await cowService.updateCowInDB(id, updatedData);

  if (result === null) {
    sendResponse<ICow>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Cow with ID ${id} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<ICow>(res, {
      statusCode: 200,
      success: true,
      message: 'Cow updated successfully',
      data: result,
    });
  }
});

const deleteCow: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await cowService.deleteCowFromDB(id);

  if (result === null) {
    sendResponse<ICow>(res, {
      statusCode: 404,
      success: false,
      message: `Error: Cow with ID ${id} is not found. Please verify the provided ID and try again`,
      data: result,
    });
  } else {
    sendResponse<ICow>(res, {
      statusCode: 200,
      success: true,
      message: 'Cow deleted successfully',
      data: result,
    });
  }
});

const getAllCows: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, cowFilterableFields);

  const paginationOptions = pick(req.query, paginationFields);

  const result = await cowService.getAllCowsFromDB(filters, paginationOptions);

  sendResponse<ICow[]>(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const cowController = {
  createCow,
  getSingleCow,
  updateCow,
  deleteCow,
  getAllCows,
};
