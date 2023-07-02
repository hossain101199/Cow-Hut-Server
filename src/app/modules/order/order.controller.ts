import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import { orderService } from './order.service';

const createOrder: RequestHandler = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }
  const order = req.body;
  const result = await orderService.createOrderInDB(token, order);

  sendResponse<IOrder>(res, {
    statusCode: 200,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getSingleOrder: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await orderService.getSingleOrderFromDB(id);

  if (result === null) {
    throw new ApiError(
      404,
      `Error: Order with ID ${id} is not found. Please verify the provided ID and try again`
    );
  } else {
    sendResponse<IOrder>(res, {
      statusCode: 200,
      success: true,
      message: 'Order information retrieved successfully',
      data: result,
    });
  }
});

const getAllOrders: RequestHandler = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);

  const result = await orderService.getAllOrdersFromDB(paginationOptions);

  sendResponse<IOrder[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Order retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const orderController = {
  createOrder,
  getSingleOrder,
  getAllOrders,
};
