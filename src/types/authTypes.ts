export type Email = {
  email: string;
};

export type SigninUser = {
  email: string;
  password: string;
};

export type AccountType = 'PERSONAL' | 'COMPANY';

export type SignupUserPersonal = {
  email: string;
  password: string;
  accountType: string;
  userName: string;
  contactNo: string;
};

export type SignupUserCompany = {
  email: string;
  password: string;
  companyName: string;
  accountType: string;
  country: string;
  contactNo: string;
};

// Normal response type
export type ServerResponseMessageStatus = {
  message: string;
  status: string;
};

// Signup Validations
type SignupValidationErrorBody = {
  location: string;
  msg: string;
  param: string;
  value: string;
};

type ServerSignupValidationData = {
  errors: Array<SignupValidationErrorBody>;
};

export type ServerSignupValidationError = {
  data: ServerSignupValidationData;
  message: string;
  status: string;
};

export type ServerErrorField = {
  param: string;
  msg: string;
};

// General Type "userID" with "token" for verify email and reset new password
export type UserIdWithToken = {
  userId: string;
  token: string;
};

// NewPassword
export type NewPassword = {
  newPassword: string;
};

export type ResetPasswordWithUserIdAndToken = {
  newPassword: string;
  userId: string;
  token: string;
};

// Login Successful Types
export type LoginSuccessDataTypeForUser = {
  companyName?: string;
  userName?: string;
  country?: string;
  accountType: string;
  contactNo: number;
  email: string;
};

export type LoginSuccessType = {
  message: string;
  status: string;
  data: {
    token: string; // JWE Token
    user: LoginSuccessDataTypeForUser;
  };
};
