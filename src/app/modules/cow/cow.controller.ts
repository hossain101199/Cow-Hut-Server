import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
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

export const cowController = {
  createCow,
  getSingleCow,
};