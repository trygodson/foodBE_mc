import { Request, Response } from 'express';
import { CreateVendorInput } from '../dto';
import { Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

export const FindVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById(id);
  }
};

export const CreateVendor = async (req: Request, res: Response) => {
  const { address, email, foodtype, name, ownername, password, phone, pincode } = <
    CreateVendorInput
  >req.body;

  const vendorExist = await FindVendor('', email);

  if (vendorExist !== null) {
    res.json({ message: 'A vendor Exist with this email ID' });
  } else {
    const salt = await GenerateSalt();
    const userpassword = await GeneratePassword(password, salt);

    const createvendor = await Vendor.create({
      address: address,
      email: email,
      foodtype: foodtype,
      name: name,
      ownername: ownername,
      password: userpassword,
      phone: phone,
      pincode: pincode,
      rating: 0,
      serviceAvailable: false,
      coverimages: [],
      salt: salt,
      food: [],
    });

    return res.status(200).json(createvendor);
  }
};
export const GetVendor = async (req: Request, res: Response) => {
  const vendor = await Vendor.find();
  if (vendor !== null) {
    res.status(200).json(vendor);
  }
  return res.json({ message: 'No Vendors available' });
};
export const GetVendorByID = async (req: Request, res: Response) => {
  const vendorId = req.params.id;

  const vendor = await FindVendor(vendorId);
  if (vendor !== null) {
    res.status(200).json(vendor);
  }
  return res.json({ message: 'No Vendors with that ID' });
};
