import { ICow } from './cow.interface';
import { cow } from './cow.model';

const createCowInDB = async (payload: ICow): Promise<ICow> => {
  const createdCow = (await cow.create(payload)).populate('seller');
  return createdCow;
};

const getSingleCowFromDB = async (id: string): Promise<ICow | null> => {
  const result = await cow.findById(id).populate('seller');
  return result;
};

export const cowService = {
  createCowInDB,
  getSingleCowFromDB,
};
