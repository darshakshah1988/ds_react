import { apiUrl } from '../../config';
import { artistFetchWrapper } from '../helpers';

export const artistService = {
  getArtists,
  getCount,
  getFreeSearchArtists,
  addArtist,
  addNotableArt,
  editArtist,
  editNotableArt,
  deleteNotableArt,
  deleteArtist,
  addMultipleNotableArt,
  getClientSideArtistDetails,
  getServersideArtistDetails
};

const baseUrl = `${apiUrl}/artist`;

// 1
function getArtists(data: any) {
  return artistFetchWrapper.getArtists(baseUrl, data);
}

// 2
function getCount(data: any) {
  return artistFetchWrapper.getCount(baseUrl, data);
}

// 3
function getFreeSearchArtists(data: any) {
  return artistFetchWrapper.getFreeSearchArtists(baseUrl, data);
}

// 4
function addArtist(
  formData: any,
  token: string,
  uploadState?: (progress: number) => void
) {
  return artistFetchWrapper.postAddArtist(
    baseUrl,
    formData,
    token,
    uploadState
  );
}

// 5
function addNotableArt(
  formData: any,
  token: string,
  uploadState?: (progress: number) => void
) {
  return artistFetchWrapper.postAddNotableArt(
    baseUrl,
    formData,
    token,
    uploadState
  );
}

// 6
function editArtist(
  formData: any,
  token: string,
  uploadState?: (progress: number) => void
) {
  return artistFetchWrapper.putEditArtist(
    baseUrl,
    formData,
    token,
    uploadState
  );
}

// 7
function editNotableArt(
  formData: any,
  token: string,
  uploadState?: (progress: number) => void
) {
  return artistFetchWrapper.putEditNotableArt(
    baseUrl,
    formData,
    token,
    uploadState
  );
}

// 8
function deleteNotableArt(data: any, token: string) {
  return artistFetchWrapper.deleteNotableArt(baseUrl, data, token);
}

// 9
function deleteArtist(data: any, token: string) {
  return artistFetchWrapper.deleteArtist(baseUrl, data, token);
}

// 10
function addMultipleNotableArt(requests: Array<any>) {
  return artistFetchWrapper.postAddMultipleNotableArt(requests);
}

// 11
function getClientSideArtistDetails(artistId: string, authToken: string) {
  return artistFetchWrapper.getClientSideArtistDetails(
    baseUrl,
    artistId,
    authToken
  );
}

// 12
// NOTE: This function should only use in the Next.js getServersideProps function.
// This will return a promise that you have to resolve.
function getServersideArtistDetails(ServersidePropsContext: any) {
  return artistFetchWrapper.getServerSideArtistDetails(ServersidePropsContext);
}
