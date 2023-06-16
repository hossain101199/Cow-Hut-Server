import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

// cow.interface.ts
export enum location {
  Dhaka = 'Dhaka',
  Chattogram = 'Chattogram',
  Barishal = 'Barishal',
  Rajshahi = 'Rajshahi',
  Sylhet = 'Sylhet',
  Comilla = 'Comilla',
  Rangpur = 'Rangpur',
  Mymensingh = 'Mymensingh',
}

export enum label {
  ForSale = 'for sale',
  SoldOut = 'sold out',
}

export enum category {
  Dairy = 'Dairy',
  Beef = 'Beef',
  DualPurpose = 'Dual Purpose',
}

export type ICow = {
  name: string;
  age: number;
  price: number;
  location: location;
  breed: string;
  weight: number;
  label: label;
  category: category;
  seller: Types.ObjectId | IUser;
};

export type cowModel = Model<ICow>;
