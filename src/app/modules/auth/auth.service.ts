import { IUser } from '../user/user.interface';
import { user } from '../user/user.model';

const createUserInDB = async (payload: IUser): Promise<IUser> => {
  if (payload.role == 'seller') {
    payload.budget = 0;
  }
  const createdUser = await user.create(payload);
  return createdUser;
};

export const authService = {
  createUserInDB,
};
