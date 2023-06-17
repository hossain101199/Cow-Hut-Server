import { Schema, model } from 'mongoose';
import { ICow, category, label, location } from './cow.interface';

const cowSchema = new Schema<ICow>(
  {
    name: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, enum: Object.values(location), required: true },
    breed: { type: String, required: true },
    weight: { type: Number, required: true },
    label: { type: String, enum: Object.values(label), default: label.ForSale },
    category: { type: String, enum: Object.values(category), required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const cow = model<ICow>('cow', cowSchema);
