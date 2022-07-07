import express, { Request, Response, NextFunction } from 'express';
import { CreateVendor, GetVendor, GetVendorByID } from '../controllers';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Hello From Admin' });
});

router.post('/vendor', CreateVendor);
router.get('/vendor', GetVendor);
router.get('/vendor/:id', GetVendorByID);

export { router as AdminRoute };
