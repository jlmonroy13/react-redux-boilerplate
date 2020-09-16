import axios from 'axios';
import { POST, PUT, GET, DELETE, PATCH } from './httpMethods';

const defaultHeaders = {};

const baseURL = process.env.REACT_APP_API_URL;

const request = (method, url, headers, axiosConfig = {}) =>
  axios({
    method,
    url,
    baseURL,
    headers: { ...defaultHeaders, ...headers },
    responseType: 'json',
    ...axiosConfig,
  });

export default {
  [POST]: (url, { headers = {}, data = {}, params = {} }) =>
    request(POST, url, headers, {
      data,
      params,
    }),
  [PUT]: (url, { headers = {}, data = {}, params = {} }) =>
    request(PUT, url, headers, {
      data,
      params,
    }),
  [PATCH]: (url, { headers = {}, data = {}, params = {} }) =>
    request(PATCH, url, headers, {
      data,
      params,
    }),
  [GET]: (url, { headers = {}, params = {} }) =>
    request(GET, url, headers, {
      params,
    }),
  [DELETE]: (url, { headers = {}, params = {} }) =>
    request(DELETE, url, headers, {
      params,
    }),
};
