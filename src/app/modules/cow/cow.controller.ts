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

export const cowController = {
  createCow,
};
