import express from 'express';
import {
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  RequestOTP,
} from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();

//signup create user
router.post('/signup', CustomerSignUp);

//login
router.post('/login', CustomerLogin);

//authenticate
router.use(Authenticate);

//verify customer account
router.patch('/verify', CustomerVerify);

//otp
router.get('/otp', RequestOTP);

//profile
router.get('/profile', GetCustomerProfile);
router.patch('/profile', EditCustomerProfile);

//carts
//orders

//payments

export { router as CustomerRoute };
