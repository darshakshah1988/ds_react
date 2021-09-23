import { apiUrl } from '../../config';
import { EditUserPasswordWithAuthToken } from '../types';
import { userFetchWrapper } from '../helpers';

export const userService = {
  editPassword,
  getClientSideUserDetails,
  getServersideAuthUserDetails
};

const baseUrl = `${apiUrl}/user`;

function editPassword(params: EditUserPasswordWithAuthToken) {
  return userFetchWrapper.putEditPassword(baseUrl, params);
}

function getClientSideUserDetails(authToken: string) {
  return userFetchWrapper.getClientSideUserDetails(baseUrl, authToken);
}

// NOTE: This function should only use in the Next.js getServersideProps function.
// This will return a promise that you have to resolve.
function getServersideAuthUserDetails(ServersidePropsContext: any) {
  return userFetchWrapper.getServerSideUserDetails(ServersidePropsContext);
}
