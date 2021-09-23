import * as Yup from 'yup';

import { CLIENT_SIDE_RULES } from '../constants';
import { onlyAlphabets, password, validateEmail } from './validations';

// -------------------- Authentication Validation rules --------------------

// Signin Validation Schema
export const signinValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(CLIENT_SIDE_RULES.EMAIL.MESSAGE_2)
    .required(CLIENT_SIDE_RULES.EMAIL.MESSAGE_1),
  password: Yup.string()
    .transform(x => (x === '' ? undefined : x))
    .concat(Yup.string().required(CLIENT_SIDE_RULES.PASSWORD.MESSAGE_1))
});

// Signup Personal Validation Schema
export const signupPersonalValidationSchema = Yup.object().shape({
  userName: Yup.string()
    .required(CLIENT_SIDE_RULES.USERNAME.MESSAGE_1)
    .test('userName', CLIENT_SIDE_RULES.USERNAME.MESSAGE_2, value =>
      onlyAlphabets(value)
    ),
  email: Yup.string()
    .email(CLIENT_SIDE_RULES.EMAIL.MESSAGE_2)
    .required(CLIENT_SIDE_RULES.EMAIL.MESSAGE_1)
    .test('email', CLIENT_SIDE_RULES.EMAIL.MESSAGE_2, value =>
      validateEmail(value)
    ),
  password: Yup.string()
    .transform(x => (x === '' ? undefined : x))
    .concat(Yup.string().required(CLIENT_SIDE_RULES.PASSWORD.MESSAGE_1))
    .test('password', CLIENT_SIDE_RULES.PASSWORD.MESSAGE_2, value =>
      password(value)
    )
});

// Signup Company Validation Schema
export const signupCompanyValidationSchema = Yup.object().shape({
  companyName: Yup.string()
    .required(CLIENT_SIDE_RULES.COMPANY.MESSAGE_1)
    .test('companyName', CLIENT_SIDE_RULES.COMPANY.MESSAGE_2, value =>
      onlyAlphabets(value)
    ),
  email: Yup.string()
    .email(CLIENT_SIDE_RULES.EMAIL.MESSAGE_2)
    .required(CLIENT_SIDE_RULES.EMAIL.MESSAGE_1)
    .test('email', CLIENT_SIDE_RULES.EMAIL.MESSAGE_2, value =>
      validateEmail(value)
    ),
  password: Yup.string()
    .transform(x => (x === '' ? undefined : x))
    .concat(Yup.string().required(CLIENT_SIDE_RULES.PASSWORD.MESSAGE_1))
    .test('password', CLIENT_SIDE_RULES.PASSWORD.MESSAGE_2, value =>
      password(value)
    )
});

// ForgetPassword Validation Schema
export const forgetPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(CLIENT_SIDE_RULES.EMAIL.MESSAGE_2)
    .required(CLIENT_SIDE_RULES.EMAIL.MESSAGE_1)
    .test('email', CLIENT_SIDE_RULES.EMAIL.MESSAGE_2, value =>
      validateEmail(value)
    )
});

// Scheme to reset password with email token
export const resetPasswordTokenValidationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .transform(x => (x === '' ? undefined : x))
    .concat(Yup.string().required(CLIENT_SIDE_RULES.NEW_PASSWORD.MESSAGE_1))
    .test('newPassword', CLIENT_SIDE_RULES.NEW_PASSWORD.MESSAGE_2, value =>
      password(value)
    )
});

// Scheme to update password from user account
export const userNewPasswordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .transform(x => (x === '' ? undefined : x))
    .concat(Yup.string().required(CLIENT_SIDE_RULES.OLD_PASSWORD.MESSAGE_1)),
  newPassword: Yup.string()
    .transform(x => (x === '' ? undefined : x))
    .concat(Yup.string().required(CLIENT_SIDE_RULES.NEW_PASSWORD.MESSAGE_1))
    .test('newPassword', CLIENT_SIDE_RULES.NEW_PASSWORD.MESSAGE_2, value =>
      password(value)
    )
});

// -------------------- End - Authentication Validation rules --------------------
