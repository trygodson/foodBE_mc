import express, { Request, Response, NextFunction } from 'express';
import { Vendor } from '../../models';

export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({ pincode: pincode, serviceAvailable: false })
    .sort({ rating: 'desc' })
    .populate('food');

  if (result !== null) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: 'Data not found' });
};
