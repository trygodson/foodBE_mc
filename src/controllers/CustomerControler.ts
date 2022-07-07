import express, { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateCustomerInputs,
  UserLoginInput,
  EditCustomerProfileInput,
} from '../dto/Customer.dto';
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  onRequestOTP,
  ValidatePassword,
} from '../utility';
import { Customer } from '../models/Customer';

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  } else {
    const { email, password, phone } = customerInputs;
    const salt = await GenerateSalt();
    const userpassword = await GeneratePassword(password, salt);

    const { expiry, otp } = GenerateOtp();

    const existingCustomer = await Customer.findOne({ email: email });

    if (existingCustomer != null) {
      res.status(400).json({ message: 'An existing user with provided email' });
    } else {
      const result = await Customer.create({
        email: email,
        password: userpassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstname: '',
        lastname: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0,
      });

      if (result) {
        const response = await onRequestOTP(otp, phone);

        const signature = await GenerateSignature({
          _id: result._id,
          email: result.email,
          verified: result.verified,
        });

        return res.status(201).json({
          signature: signature,
          verified: result.verified,
          email: result.email,
        });
      } else {
        res.status(400).json({ message: 'Error with signup' });
      }
    }
  }
};

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
  const loginInputs = plainToClass(UserLoginInput, req.body);

  const loginErrors = await validate(loginInputs, {
    validationError: { target: true },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  } else {
    const { email, password } = loginInputs;
    const customer = await Customer.findOne({ email: email });
    if (customer != null) {
      const validation = await ValidatePassword(password, customer.password, customer.salt);

      if (validation) {
        const signature = await GenerateSignature({
          _id: customer._id,
          email: customer.email,
          verified: customer.verified,
        });

        return res.status(201).json({
          signature: signature,
          verified: customer.verified,
          email: customer.email,
        });
      }
    }
    res.status(400).json({ message: 'Error Login In' });
  }
};

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;
        const updatedCustomerResponse = await profile.save();
        const signature = await GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });
        return res.status(201).json({
          signature: signature,
          verified: updatedCustomerResponse.verified,
          email: updatedCustomerResponse.email,
        });
      }
    }
  }
  res.status(400).json({ message: 'Error with OTP validation' });
};

export const RequestOTP = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile != null) {
      const { otp, expiry } = GenerateOtp();
      profile.otp = otp;
      profile.otp_expiry = expiry;
      await profile.save();

      await onRequestOTP(otp, profile.phone);

      return res.status(200).json({ message: 'OTP sent to your registered phone' });
    }
  }
};

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile != null) {
      return res.status(200).json(profile);
    }
    res.status(400).json({ message: 'Error fetching Profile' });
  }
};

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  const profileInput = plainToClass(EditCustomerProfileInput, req.body);
  const profileErrors = await validate(profileInput, {
    validationError: { target: true },
  });

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  } else {
    const { firstname, lastname, address } = profileInput;
    if (customer) {
      const profile = await Customer.findById(customer._id);
      if (profile != null) {
        profile.firstname = firstname;
        profile.lastname = lastname;
        profile.address = address;

        const result = await profile.save();
        return res.status(200).json(result);
      }
    }
  }
};
