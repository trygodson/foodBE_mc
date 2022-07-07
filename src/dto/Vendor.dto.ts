export interface CreateVendorInput {
  name: string;
  ownername: string;
  foodtype: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface VendorLoginInput {
  email: string;
  password: string;
}

export interface VendorPayload {
  _id: string;
  email: string;
  name: string;
  foodtype: [string];
}

export interface EditVendorInput {
  address: string;
  phone: string;
  foodtype: [string];
  name: string;
}
