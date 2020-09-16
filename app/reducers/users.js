/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit';

import { FULFILLED, PENDING, REJECTED } from 'utils/constants';

import { getUsers, createUser } from 'actions/users';

const initialState = {
  users: [],
  getUsersStatus: null,
};

export default createReducer(initialState, {
  [String(getUsers.pending)]: state => {
    state.getUsersStatus = PENDING;
  },
  [String(getUsers.fulfilled)]: (state, action) => {
    state.getUsersStatus = FULFILLED;
    state.users = action.payload.results;
  },
  [String(getUsers.rejected)]: state => {
    state.getUsersStatus = REJECTED;
  },
  [String(createUser)]: state => {
    state.users = [...state.users, { name: `User ${state.users.length}` }]; //
  },
});
