import http from './http';

export const apiCall = (method, url, options) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const httpMethod = http[method];

  return httpMethod(url, {
    headers,
    ...options,
  });
};
