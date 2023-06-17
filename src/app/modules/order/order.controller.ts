import { RequestHandler } from 'express';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import { orderService } from './order.service';

const createOrder: RequestHandler = catchAsync(async (req, res) => {
  const order = req.body;
  const result = await orderService.createOrderInDB(order);

  sendResponse<IOrder>(res, {
    statusCode: 200,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
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
  getAllOrders,
};
