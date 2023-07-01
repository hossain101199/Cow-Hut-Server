// User interface
export type IUserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
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
