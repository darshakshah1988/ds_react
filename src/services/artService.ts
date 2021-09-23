import { apiUrl } from '../../config';
import { artFetchWrapper } from '../helpers';

export const artService = {
  getArts,
  getCount,
  getFreeSearchArts,
  addArtUpload,
  addArtDetails,
  editArtTypeDetails,
  deleteArt
};

const baseUrl = `${apiUrl}/art`;

// 1
function getArts(data: any) {
  return artFetchWrapper.getArts(baseUrl, data);
}

// 2
function getCount(data: any) {
  return artFetchWrapper.getCount(baseUrl, data);
}

// 3
function getFreeSearchArts(data: any) {
  return artFetchWrapper.getFreeSearchArts(baseUrl, data);
}

// 4
function addArtUpload(
  formData: any,
  token: string,
  uploadState?: (progress: number) => void
) {
  return artFetchWrapper.postAddArtUpload(
    baseUrl,
    formData,
    token,
    uploadState
  );
}

// 5
function addArtDetails(data: any, token: string) {
  return artFetchWrapper.postAddArtDetails(baseUrl, data, token);
}

// 6 This edit detail will be related to art phases, like investment, sales, stats
function editArtTypeDetails(data: any, token: string) {
  return artFetchWrapper.putEditArtTypeDetails(baseUrl, data, token);
}

// 7
function deleteArt(data: any, token: string) {
  return artFetchWrapper.deleteArt(baseUrl, data, token);
}
