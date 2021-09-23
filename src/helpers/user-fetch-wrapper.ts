import https from 'https'; // Node.js module
import axios from 'axios';
import nextCookie from 'next-cookies';

import { EditUserPasswordWithAuthToken } from '../types';
import { handleRejectPromise, handleResolvePromise } from './fetchHelpers';
import { userService } from '../services';

export const userFetchWrapper = {
  putEditPassword,
  getClientSideUserDetails,
  getServerSideUserDetails
};

// editUserPassword function
function putEditPassword(url: string, params: EditUserPasswordWithAuthToken) {
  const { token, oldPassword, newPassword } = params;

  return axios
    .put(
      `${url}/password`,
      {
        oldPassword: oldPassword,
        newPassword: newPassword
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          auth: token
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      }
    )
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// getClientSideUserDetails function
function getClientSideUserDetails(url: string, authToken: string) {
  return axios
    .get(`${url}/detail`, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        auth: authToken
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// NOTE: This function should only use in the Next.js getServersideProps function.
// This will return a promise that you have to resolve.
async function getServerSideUserDetails(ServersidePropsContext: any) {
  const cookies = nextCookie(ServersidePropsContext);
  const token = cookies?.token ? cookies.token : '';
  return await userService
    .getClientSideUserDetails(token)
    .then(function(response) {
      return response?.data ? response.data : null;
    })
    .catch(function(err) {
      return err;
    });
}
