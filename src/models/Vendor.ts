import mongoose, { Document, Model, Schema } from 'mongoose';

interface VendorDoc extends Document {
  name: string;
  ownername: string;
  foodtype: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverimages: [string];
  ratings: number;
  food: any;
}

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownername: { type: String, required: true },
    foodtype: { type: [String] },
    pincode: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverimages: { type: [String] },
    ratings: { type: Number },
    food: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'food',
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  },
);

const Vendor = mongoose.model<VendorDoc>('vendor', VendorSchema);
export { Vendor };
