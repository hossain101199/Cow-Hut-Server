import { ObjectId } from 'mongoose';

// User interface
export type IUserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  _id?: ObjectId;
  password: string;
  role: 'seller' | 'buyer';
  name: IUserName;
  phoneNumber: string;
  address: string;
  budget: number;
  income: number;
};

export type IUserFilters = {
  searchTerm?: string;
};
