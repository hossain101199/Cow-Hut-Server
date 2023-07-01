import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
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

// This code is executed before saving a user document to the database
userSchema.pre('save', async function (next) {
  // Hash the password using bcrypt
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );

  // Call the next middleware or save the document
  next();
});

export const User = model<IUser>('user', userSchema);
