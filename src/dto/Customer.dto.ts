import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateCustomerInputs {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(7, 12)
  phone: string;

  @IsNotEmpty()
  @Length(6, 12)
  password: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class UserLoginInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 12)
  password: string;
}

export class EditCustomerProfileInput {
  @IsNotEmpty()
  @Length(3, 16)
  firstname: string;

  @IsNotEmpty()
  @Length(6, 12)
  lastname: string;

  @IsNotEmpty()
  @Length(6, 12)
  address: string;
}
