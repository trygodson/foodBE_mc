import express, { Application } from 'express';
import { AdminRoute, CustomerRoute, VendorRoutes } from '../routes';
import { MONGO_URL } from '../config';
import path from 'path';
import { ShoppingRoute } from '../routes/ShoppingRoute';

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/admin', AdminRoute);
  app.use('/vendor', VendorRoutes);
  app.use('/shopping', ShoppingRoute);
  app.use('/customer', CustomerRoute);

  return app;
};
