import { Request, Response, NextFunction } from 'express';
import { formatDiagnostic } from 'typescript';
import { EditVendorInput, VendorLoginInput } from '../dto';
import { CreateFoodInput } from '../dto/Food.dto';
import { Food, Vendor } from '../models';
import { GenerateSignature, ValidatePassword } from '../utility';
import { FindVendor } from './AdminController';

export const GetParticalarVendor = async (req: Request, res: Response) => {
  const vendorId = req.params.id;

  const vendor = await FindVendor(vendorId);
  if (vendor !== null) {
    res.status(200).json(vendor);
  }
  return res.json({ message: 'No Vendors with that ID' });
};

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = <VendorLoginInput>req.body;

  const existingVendor = await Vendor.findOne({ email: email });

  if (existingVendor !== null) {
    const validation = await ValidatePassword(
      password,
      existingVendor.password,
      existingVendor.salt,
    );
    if (validation) {
      const signature = await GenerateSignature({
        _id: existingVendor._id,
        email: existingVendor.email,
        foodtype: existingVendor.foodtype,
        name: existingVendor.name,
      });
      // return res.status(200).json(existingVendor);
      return res.status(200).json(signature);
    } else {
      return res.json({ message: 'Password not correct' });
    }
  }
  return res.status(400).json({ message: 'Login crdentials not valid' });
};

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const existingvendor = await FindVendor(user._id);
    return res.status(200).json(existingvendor);
  }
  return res.status(401).json({ message: 'Vendor not found' });
};

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { name, phone, foodtype, address } = <EditVendorInput>req.body;

  const user = req.user;
  if (user) {
    const existingvendor = await FindVendor(user._id);
    if (existingvendor !== null) {
      (existingvendor.name = name),
        (existingvendor.phone = phone),
        (existingvendor.foodtype = foodtype),
        (existingvendor.address = address);

      const savedresult = await existingvendor.save();

      return res.status(200).json(savedresult);
    }
  }
  return res.status(401).json({ message: 'Vendor not found' });
};

export const UpdateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const theFiles = req.files as [Express.Multer.File];

      const images = theFiles.map((file: Express.Multer.File) => file.filename);

      vendor.coverimages.push(...images);
      const result = await vendor.save();
      return res.status(200).json(result);
    }
  }
  return res.status(401).json({ message: 'Something went wrong adding food' });
};

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
  const { name, phone, foodtype, address } = <EditVendorInput>req.body;

  const user = req.user;
  if (user) {
    const existingvendor = await FindVendor(user._id);
    if (existingvendor !== null) {
      existingvendor.serviceAvailable = !existingvendor.serviceAvailable;
      const savedresult = await existingvendor.save();

      return res.status(200).json(savedresult);
    }
  }
  return res.status(401).json({ message: 'Vendor not found' });
};

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const { category, description, foodtype, name, price, readytime } = <CreateFoodInput>req.body;
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const theFiles = req.files as [Express.Multer.File];

      const images = theFiles.map((file: Express.Multer.File) => file.filename);
      const createdFood = await Food.create({
        vendorid: vendor._id,
        name: name,
        description: description,
        category: category,
        foodtype: foodtype,
        images: images,
        readytime: readytime,
        price: price,
        rating: 0,
      });
      vendor.food.push(createdFood);
      const result = await vendor.save();
      return res.status(200).json(result);
    }
  }
  return res.status(401).json({ message: 'Something went wrong adding food' });
};

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const foods = await Food.find({ vendorid: user._id });
    if (foods != null) {
      return res.status(200).json(foods);
    }
    return res.status(401).json({ message: 'Something went wrong getting food' });
  }
  return res.status(401).json({ message: 'Food information not found' });
};
