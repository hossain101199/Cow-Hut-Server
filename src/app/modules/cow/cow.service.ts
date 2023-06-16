import { ICow } from './cow.interface';
import { cow } from './cow.model';

const createCowInDB = async (payload: ICow): Promise<ICow> => {
  const createdCow = await cow.create(payload);
  return createdCow;
};

export const cowService = {
  createCowInDB,
};
