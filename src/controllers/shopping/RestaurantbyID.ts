import express, { Request, Response, NextFunction } from 'express';
import { Vendor } from '../../models';

export const RestaurantByID = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const result = await Vendor.findById(id).populate('food');

  if (result) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: 'Data not found' });
};
