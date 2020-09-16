import {
  createAsyncAction,
  createAction,
} from 'redux-promise-middleware-actions';

import { reqGetUsers } from 'api/users';

export const getUsers = createAsyncAction('GET_USERS', () =>
  reqGetUsers().then(({ data }) => data),
);

export const createUser = createAction('CREATE_USER');
