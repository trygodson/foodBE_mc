import mongoose, { Document, Model, Schema } from 'mongoose';

export interface FoodDoc extends Document {
  vendorid: string;
  name: string;
  description: string;
  category: string;
  readytime: number;
  price: number;
  foodtype: string;
  rating: number;
  images: [string];
}

const foodSchema = new Schema(
  {
    vendorid: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    readytime: { type: Number, required: true },
    price: { type: Number },
    foodtype: { type: String, required: true },
    rating: { type: Number },
    images: { type: [String] },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  },
);

const Food = mongoose.model<FoodDoc>('food', foodSchema);

export { Food };
