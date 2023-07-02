import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import mongoose, { SortOrder } from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { label } from '../cow/cow.interface';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrderInDB = async (
  token: string,
  payload: IOrder
): Promise<IOrder> => {
  const verifiedToken = jwt.verify(
    token,
    config.jwt.secret as Secret
  ) as JwtPayload;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { cow } = payload;

    // Find the cow to be purchased
    const selectedCow = await Cow.findOne({
      _id: cow,
      label: 'for sale',
    }).session(session);

    if (!selectedCow) {
      throw new ApiError(400, `Error: Invalid cow or not available for sale.`);
    }

    // Find the buyer
    const selectedBuyer = await User.findOne({
      _id: verifiedToken.id,
      role: 'buyer',
    }).session(session);

    if (!selectedBuyer) {
      // User role is not valid
      throw new ApiError(400, `Error: Invalid buyer or insufficient role.`);
    }

    if (selectedBuyer.budget < selectedCow.price) {
      throw new ApiError(400, `Error: Insufficient funds.`);
    }

    // Deduct the cost from the buyer's budget
    selectedBuyer.budget -= selectedCow.price;

    // Save the updated buyer document
    await selectedBuyer.save();

    const seller = await User.findById(selectedCow.seller).session(session);

    if (seller) {
      // Add the cost to the seller's income
      seller.income += selectedCow.price;
      // Save the updated seller document
      await seller.save();
    }

    // Update the cow's status to 'Sold Out'
    selectedCow.label = label.SoldOut;

    // Save the updated cow document
    await selectedCow.save();

    payload.buyer = selectedBuyer;
    payload.cow = selectedCow;

    const createdOrder = (await Order.create(payload)).populate([
      { path: 'cow', populate: { path: 'seller' } },
      { path: 'buyer' },
    ]);

    await session.commitTransaction();
    await session.endSession();

    return createdOrder;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getSingleOrderFromDB = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id).populate([
    { path: 'cow', populate: { path: 'seller' } },
    { path: 'buyer' },
  ]);

  return result;
};

const getAllOrdersFromDB = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Order.find()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate([
      { path: 'cow', populate: { path: 'seller' } },
      { path: 'buyer' },
    ]);

  const total = await Order.countDocuments().limit(limit);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const orderService = {
  createOrderInDB,
  getSingleOrderFromDB,
  getAllOrdersFromDB,
};
