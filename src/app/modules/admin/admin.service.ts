import bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { ILogin, ILoginUserResponse } from '../../../interfaces/common';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdminInDB = async (payload: IAdmin): Promise<IAdmin> => {
  const createdAdmin = await Admin.create(payload);
  return createdAdmin;
};

const loginAdmin = async (payload: ILogin): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;

  const isUserExist = await Admin.findOne(
    { phoneNumber },
    { id: 1, role: 1, password: 1 }
  );

  if (isUserExist) {
    if (await bcrypt.compare(password, isUserExist.password)) {
      const { id, role } = isUserExist;

      const accessToken = jwt.sign(
        {
          id,
          role,
        },
        config.jwt.secret as Secret,
        { expiresIn: config.jwt.expires_in }
      );

      const refreshToken = jwt.sign(
        {
          id,
          role,
        },
        config.jwt.refresh_secret as Secret,
        { expiresIn: config.jwt.refresh_expires_in }
      );

      return {
        accessToken,
        refreshToken,
      };
    } else {
      throw new ApiError(401, 'Password is incorrect');
    }
  } else {
    throw new ApiError(404, 'Admin does not exist');
  }
};

const getProfileFromDB = async (payload: string): Promise<IAdmin | null> => {
  const verifiedToken = jwt.verify(
    payload,
    config.jwt.secret as Secret
  ) as JwtPayload;
  if (verifiedToken) {
    const result = await Admin.findById(verifiedToken.id);
    return result;
  } else {
    throw new ApiError(403, 'Forbidden');
  }
};

const updateProfileInDB = async (
  token: string,
  payload: IAdmin
): Promise<IAdmin | null> => {
  const verifiedToken = jwt.verify(
    token,
    config.jwt.secret as Secret
  ) as JwtPayload;
  const { name, password, ...adminData } = payload;

  const updatedUserData: Partial<IAdmin> = { ...adminData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>;
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds)
    );
    updatedUserData.password = hashedPassword;
  }

  if (verifiedToken) {
    const result = await Admin.findByIdAndUpdate(
      verifiedToken.id,
      updatedUserData,
      {
        new: true,
      }
    );

    return result;
  } else {
    throw new ApiError(403, 'Forbidden');
  }
};
export const adminService = {
  createAdminInDB,
  loginAdmin,
  getProfileFromDB,
  updateProfileInDB,
};
