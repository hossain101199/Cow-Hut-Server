import { Schema, model } from 'mongoose';
import { userRole } from './user.constant';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    password: { type: String, required: true },
    role: { type: String, enum: userRole, required: true },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    budget: { type: Number, required: true },
    income: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
      },
    },
  }
);

export const user = model<IUser>('user', userSchema);
