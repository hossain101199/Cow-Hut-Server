export type IAdmin = {
  password: string;
  role: 'admin';
  name: {
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  address: string;
};
