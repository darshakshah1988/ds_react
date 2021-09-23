import { ServerSignupValidationError, ServerErrorField } from '../types';

export function getServerValidationErrors(
  validation: ServerSignupValidationError | null
): Array<ServerErrorField> {
  if (
    validation?.data?.errors &&
    Array.isArray(validation.data.errors) &&
    validation.data.errors.length > 0
  ) {
    const serverErrorFields: Array<ServerErrorField> = [];
    const length = validation.data.errors.length;
    for (let i = 0; i < length; i++) {
      serverErrorFields.push({
        param: validation.data.errors[i].param,
        msg: validation.data.errors[i].msg
      });
    }
    return serverErrorFields;
  }
  return [];
}

export function validateEmail(email: string | undefined): boolean {
  if (email) {
    const regexp = /^[A-Z0-9._+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return regexp.test(email.toLowerCase());
  }
  return false;
}

export function onlyAlphabets(value: string | undefined): boolean {
  if (value) {
    const regexp = /^[A-Z]+$/i;
    return regexp.test(value);
  }
  return false;
}

export function onlyAlphabetsAndSpace(value: string | undefined): boolean {
  if (value) {
    const regexp = /^[a-zA-Z ]*$/;
    return regexp.test(value);
  }
  return false;
}

export function onlyPositiveNumeric(value: string | undefined): boolean {
  if (value) {
    const regexp = /^[0-9]+$/;
    return regexp.test(value);
  }
  return false;
}

export function onlyPositiveNumericAndFraction(
  value: string | undefined
): boolean {
  if (value) {
    const regexp = /^([0-9]+(?:[\\.][0-9]*)?|\.[0-9]+)$/;
    return regexp.test(value);
  }
  return false;
}

export function password(value: string | undefined): boolean {
  if (value) {
    // Minimum six and maximum 12 characters, at least one uppercase letter,
    // one number and one special character.
    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
    return regexp.test(value);
  }
  return false;
}

export function phone(value: string | undefined): boolean {
  if (value) {
    const regexp = /^[0-9]{1,16}$/;
    return regexp.test(value);
  }
  return false;
}
