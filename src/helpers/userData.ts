import { LoginSuccessDataTypeForUser } from '../types';

export function getIdentifyUserName(
  user: LoginSuccessDataTypeForUser
): string | null {
  if (user && user.companyName && !user.userName) {
    return user.companyName.toLowerCase();
  } else if (user && user.userName && !user.companyName) {
    return user.userName.toLowerCase();
  } else {
    return '';
  }
}
