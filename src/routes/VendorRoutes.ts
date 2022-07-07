import express, { Request, Response, NextFunction } from 'express';
import {
  AddFood,
  GetFoods,
  GetVendor,
  GetVendorProfile,
  UpdateVendorCoverImage,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin,
} from '../controllers';
import { Authenticate } from '../middlewares';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array('images', 10);

router.post('/login', VendorLogin);

// vendor must be authenticated first
router.use(Authenticate);
router.get('/profile', GetVendorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/coverimage', images, UpdateVendorCoverImage);
router.patch('/service', UpdateVendorService);

//foods
router.post('/food', images, AddFood);
router.get('/foods', GetFoods);

export { router as VendorRoutes };
