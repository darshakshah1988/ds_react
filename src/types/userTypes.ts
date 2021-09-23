// Type for react-hook-form useForm
export type EditUserPassword = {
  oldPassword: string;
  newPassword: string;
};

export type EditUserPasswordWithAuthToken = {
  oldPassword: string;
  newPassword: string;
  token: string;
};
