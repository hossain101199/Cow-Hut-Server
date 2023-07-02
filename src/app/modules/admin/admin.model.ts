import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { IAdmin } from './admin.interface';

const adminSchema = new Schema<IAdmin>(
  {
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin'],
      default: 'admin',
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
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
adminSchema.pre('save', async function (next) {
  // Hash the password using bcrypt
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );

  // Call the next middleware or save the document
  next();
});

export const Admin = model<IAdmin>('admin', adminSchema);
