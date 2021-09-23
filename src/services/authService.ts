import { apiUrl } from '../../config';
import { authFetchWrapper } from '../helpers';
import {
  Email,
  SigninUser,
  SignupUserCompany,
  SignupUserPersonal,
  UserIdWithToken,
  ResetPasswordWithUserIdAndToken
} from '../types';

export const authService = {
  signin,
  signupCompany,
  signupPersonal,
  verifyEmail,
  resendVerificationLink,
  forgetPassword,
  newPassword
};

const baseUrl = `${apiUrl}/user`;

function signin(params: SigninUser) {
  return authFetchWrapper.postSignin(baseUrl, params);
}

function signupCompany(params: SignupUserCompany) {
  return authFetchWrapper.postSignupCompany(baseUrl, params);
}

function signupPersonal(params: SignupUserPersonal) {
  return authFetchWrapper.postSignupPersonal(baseUrl, params);
}

function resendVerificationLink(params: Email) {
  return authFetchWrapper.postResendVerificationLink(baseUrl, params);
}

function verifyEmail(params: UserIdWithToken) {
  return authFetchWrapper.getVerifyEmail(baseUrl, params);
}

function forgetPassword(params: Email) {
  return authFetchWrapper.postForgetPassword(baseUrl, params);
}

function newPassword(params: ResetPasswordWithUserIdAndToken) {
  return authFetchWrapper.putNewPassword(baseUrl, params);
}
