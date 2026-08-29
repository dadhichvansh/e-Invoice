export type BankTransferDetails = {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  swift?: string;
};

export type UpiDetails = {
  upiId: string;
};

export type PaypalDetails = {
  email: string;
};

export type WiseDetails = {
  email: string;
};

export type OtherDetails = {
  instructions: string;
};

export type PaymentMethodDetails =
  | BankTransferDetails
  | UpiDetails
  | PaypalDetails
  | WiseDetails
  | OtherDetails;
