import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';

import reducer from 'reducers';

const preloadedState = {};

const isProd = process.env.NODE_ENV === 'production';

const baseMiddleware = [promiseMiddleware, ...getDefaultMiddleware()];

const middleware = !isProd ? [...baseMiddleware, logger] : baseMiddleware;

const store = configureStore({
  preloadedState,
  reducer,
  middleware,
  devTools: !isProd,
});

export default store;
