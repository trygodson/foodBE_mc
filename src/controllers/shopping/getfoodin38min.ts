import express, { Request, Response, NextFunction } from 'express';
import { FoodDoc, Vendor } from '../../models';

export const GetFood38Min = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({ pincode: pincode, serviceAvailable: false }).populate('food');

  if (result.length > 0) {
    let foodResult: any = [];
    result.map(vendor => {
      const foods = vendor.food as [FoodDoc];
      foodResult.push(...foods.filter(food => food.readytime <= 30));
    });
    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ message: 'No Food availabe for that time found' });
};
