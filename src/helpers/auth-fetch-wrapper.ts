import https from 'https'; // Node.js module
import axios from 'axios';

import {
  Email,
  ResetPasswordWithUserIdAndToken,
  SigninUser,
  SignupUserCompany,
  SignupUserPersonal,
  UserIdWithToken
} from '../types';
import { handleRejectPromise, handleResolvePromise } from './fetchHelpers';

export const authFetchWrapper = {
  postSignin,
  postSignupCompany,
  postSignupPersonal,
  postResendVerificationLink,
  getVerifyEmail,
  postForgetPassword,
  putNewPassword
};

// signin function
function postSignin(url: string, body: SigninUser) {
  // By default axios uses Json for posting data so we don't need to stringify our data.
  return axios
    .post(`${url}/login`, body)
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// signup company function
function postSignupCompany(url: string, body: SignupUserCompany) {
  return axios
    .post(`${url}/companysignup`, body)
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// signup personal function
function postSignupPersonal(url: string, body: SignupUserPersonal) {
  return axios
    .post(`${url}/personalsignup`, body)
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// resend verification link function
function postResendVerificationLink(url: string, body: Email) {
  return axios
    .post(`${url}/resendVerificationLink`, body)
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// get request for the verify email
function getVerifyEmail(url: string, params: UserIdWithToken) {
  const { userId, token } = params;
  return axios
    .get(`${url}/${userId}/verifyEmail/${token}`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// forget password function
function postForgetPassword(url: string, body: Email) {
  return axios
    .post(`${url}/forgetPassword`, body)
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// reset password function
function putNewPassword(url: string, params: ResetPasswordWithUserIdAndToken) {
  const { userId, token, newPassword } = params;
  const body = {
    newPassword: newPassword
  };
  return axios
    .put(`${url}/${userId}/forgetPassword/${token}`, body, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}
