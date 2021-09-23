import https from 'https'; // Node.js module
import axios from 'axios';
import nextCookie from 'next-cookies';

import { artistService } from '../services';
import { handleRejectPromise, handleResolvePromise } from './fetchHelpers';

export const artistFetchWrapper = {
  getArtists,
  getCount,
  getFreeSearchArtists,
  postAddArtist,
  postAddNotableArt,
  postAddMultipleNotableArt,
  putEditArtist,
  putEditNotableArt,
  deleteNotableArt,
  deleteArtist,
  getClientSideArtistDetails,
  getServerSideArtistDetails
};

// 1
// Get all artists
function getArtists(url: string, data: any) {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  };
  return axios
    .post(`${url}/getArtists`, data, { headers: headers })
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 2
// Get total number of records
function getCount(url: string, data: any) {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  };
  return axios
    .post(`${url}/count`, data, { headers: headers })
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 3
// Get all free search artists
function getFreeSearchArtists(url: string, data: any) {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  };
  return axios
    .post(`${url}/freeSearch/getArtists`, data, { headers: headers })
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 4
// Add Artist function
function postAddArtist(
  url: string,
  formData: any,
  token: string,
  uploadState?: (progress: number) => void
) {
  const headers = {
    'Content-Type': 'multipart/form-data',
    auth: token || ''
  };

  const axiosConfig = {
    headers: headers,
    onUploadProgress: function(progressEvent: any) {
      const { loaded, total } = progressEvent;
      const calculated = Math.round((loaded / total) * 100);
      if (uploadState) {
        uploadState(calculated);
      }
    }
  };

  return axios
    .post(`${url}/detail`, formData, axiosConfig)
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 5
// Add NotableArt function
function postAddNotableArt(
  url: string,
  formData: any,
  token: string,
  uploadState?: (progress: number) => void
) {
  const headers = {
    'Content-Type': 'multipart/form-data',
    auth: token || ''
  };

  const axiosConfig = {
    headers: headers,
    onUploadProgress: function(progressEvent: any) {
      const { loaded, total } = progressEvent;
      const calculated = Math.round((loaded / total) * 100);
      if (uploadState) {
        uploadState(calculated);
      }
    }
  };

  return axios
    .post(`${url}/notableArt/detail`, formData, axiosConfig)
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 6
// Edit Artist function
function putEditArtist(
  url: string,
  formData: any,
  token: string,
  uploadState?: (progress: number) => void
) {
  const headers = {
    'Content-Type': 'multipart/form-data',
    auth: token || ''
  };

  const axiosConfig = {
    headers: headers,
    onUploadProgress: function(progressEvent: any) {
      const { loaded, total } = progressEvent;
      const calculated = Math.round((loaded / total) * 100);
      if (uploadState) {
        uploadState(calculated);
      }
    }
  };

  return axios
    .put(`${url}/detail`, formData, axiosConfig)
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 7
// Edit NotableArt function
function putEditNotableArt(
  url: string,
  formData: any,
  token: string,
  uploadState?: (progress: number) => void
) {
  const headers = {
    'Content-Type': 'multipart/form-data',
    auth: token || ''
  };

  const axiosConfig = {
    headers: headers,
    onUploadProgress: function(progressEvent: any) {
      const { loaded, total } = progressEvent;
      const calculated = Math.round((loaded / total) * 100);
      if (uploadState) {
        uploadState(calculated);
      }
    }
  };

  return axios
    .put(`${url}/notableArt/detail`, formData, axiosConfig)
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 8
// Delete notable arts
function deleteNotableArt(url: string, data: any, token: string) {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    auth: token || ''
  };

  return axios
    .delete(`${url}/notableArt/detail`, { data: data, headers: headers })
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 9
// Delete artist
function deleteArtist(url: string, data: any, token: string) {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    auth: token || ''
  };

  return axios
    .delete(`${url}/artists`, { data: data, headers: headers })
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 10
// Add multiple upload calls for the notableArtworks
function postAddMultipleNotableArt(requests: Array<any>) {
  return axios
    .all(requests)
    .then(
      axios.spread((...responses) => {
        return responses; // It will return the responses array
      })
    )
    .catch(errors => {
      return errors; // It will return the errors array
    });
}

// 11
// Get the Artist details function
function getClientSideArtistDetails(
  url: string,
  artistId: string,
  authToken: string
) {
  return axios
    .get(`${url}/detail/${artistId}`, {
      data: { role: 'ADMIN' },
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        id: artistId,
        auth: authToken
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 12
// NOTE: This function should only use in the Next.js getServersideProps function.
// This will return a promise that you have to resolve.
async function getServerSideArtistDetails(ServersidePropsContext: any) {
  const cookies = nextCookie(ServersidePropsContext);
  const token = cookies?.token ? cookies.token : '';

  // Get Artist Id
  const {
    params: { id }
  } = ServersidePropsContext;

  return await artistService
    .getClientSideArtistDetails(id, token)
    .then(function(response) {
      return response?.data ? response.data : null;
    })
    .catch(function(err) {
      return err;
    });
}
