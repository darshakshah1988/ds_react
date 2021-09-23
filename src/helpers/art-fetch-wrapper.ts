import https from 'https'; // Node.js module
import axios from 'axios';
import nextCookie from 'next-cookies';

import { handleResolvePromise, handleRejectPromise } from './fetchHelpers';

export const artFetchWrapper = {
  getArts,
  getCount,
  getFreeSearchArts,
  postAddArtUpload,
  postAddArtDetails,
  putEditArtTypeDetails,
  deleteArt
};

// 1
// Get all arts is used to call the arts 
function getArts(url: string, data: any) {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  };
  return axios
    .post(`${url}/getArts`, data, { headers: headers })
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
// Get all free search arts
function getFreeSearchArts(url: string, data: any) {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  };
  return axios
    .post(`${url}/freeSearch/getArts`, data, { headers: headers })
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 2
// Add Art upload function
function postAddArtUpload(
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
    .post(`${url}/upload`, formData, axiosConfig)
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 3
// Add Art Details function
function postAddArtDetails(url: string, data: any, token: string) {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    auth: token || ''
  };

  const axiosConfig = {
    headers: headers
  };

  return axios
    .post(`${url}/detail`, data, axiosConfig)
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 4
// This edit detail will be related to art phases, like investment, sales, stats
function putEditArtTypeDetails(url: string, data: any, token: string) {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    auth: token || ''
  };

  const axiosConfig = {
    headers: headers
  };

  return axios
    .put(`${url}/detail`, data, axiosConfig)
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}

// 5
// Delete arts
function deleteArt(url: string, data: any, token: string) {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    auth: token || ''
  };

  return axios
    .delete(`${url}/arts`, { data: data, headers: headers })
    .then(handleResolvePromise)
    .catch(handleRejectPromise);
}
