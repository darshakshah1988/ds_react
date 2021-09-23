// Client Side Validation rules for the Authentication
export const CLIENT_SIDE_RULES = {
  EMAIL: {
    MESSAGE_1: 'Email address is required',
    MESSAGE_2: 'Invalid email address'
  },
  PASSWORD: {
    MESSAGE_1: 'Password is required',
    MESSAGE_2:
      'Password must be of 6 - 12 characters, contain at least one capital letter and one number and one special character'
  },
  COMPANY: {
    MESSAGE_1: 'Company name is required',
    MESSAGE_2: 'Company name must be alphabets'
  },
  USERNAME: {
    MESSAGE_1: 'User name is required',
    MESSAGE_2: 'User name must be alphabets'
  },
  PHONE: {
    MESSAGE_1: 'Invalid phone number'
  },
  LOGIN: {
    MESSAGE_1: 'Your Email has not been verified.'
  },
  OLD_PASSWORD: {
    MESSAGE_1: 'Old Password is required'
  },
  NEW_PASSWORD: {
    MESSAGE_1: 'New Password is required',
    MESSAGE_2:
      'New Password must be of 6 - 12 characters, contain at least one capital letter and one number and one special character'
  }
};
