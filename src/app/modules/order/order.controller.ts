import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
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

export const orderController = {
  createOrder,
};
