import { IOrder } from './order.interface';
import { order } from './order.model';

const createOrderInDB = async (payload: IOrder): Promise<IOrder> => {
  const createdOrder = await order.create(payload);
  return createdOrder;
};

export const orderService = {
  createOrderInDB,
};
