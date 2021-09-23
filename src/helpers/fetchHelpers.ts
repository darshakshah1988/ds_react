import { AxiosError, AxiosResponse } from 'axios';

export function handleResponse(response: {
  text: () => Promise<any>;
  ok: boolean;
  statusText: string;
}) {
  // The `response` object has `text()` method which is also a Promise.
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      // If the fulfilled promise response.text() `ok` property is false,
      // We will return the relevant error data.
      const error = data && data.message ? data : response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}

// Axios helper function for the resolve promise
export function handleResolvePromise(response: AxiosResponse) {
  return response.data;
}

// Axios helper function for the reject promise
// Basically, It will return a reject promise.
export function handleRejectPromise(error: AxiosError) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return Promise.reject(error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return Promise.reject({
      message: error.message
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    return Promise.reject({ message: error.message });
  }
}
