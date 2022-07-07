import express, { Request, Response, NextFunction } from 'express';
import { Vendor } from '../../models';

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({ pincode: pincode, serviceAvailable: false }).populate('food');

  if (result.length > 0) {
    let foodResult: any = [];
    result.map(item => {
      return foodResult.push(...item.food);
    });
    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ message: 'No data available' });
};
