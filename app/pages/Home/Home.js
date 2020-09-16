/* eslint-disable react/no-array-index-key */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createUser } from 'actions/users';

import logo from 'assets/images/logo.svg';

const Home = () => {
  const dispatch = useDispatch();
  const { users: usersList } = useSelector(({ users: { users } }) => ({
    users,
  }));

  return (
    <div className="home">
      <header className="home__header">
        <img src={logo} className="home__logo" alt="logo" />
        <button
          className="home__button"
          onClick={() => {
            dispatch(createUser());
          }}
        >
          Click here to create a fake user
        </button>
        <p>
          Create a fake user, then Inspect this page <br />
          and go to console to see redux logger.
        </p>
        {!!usersList.length && (
          <ul>
            {usersList.map(({ name }, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        )}
      </header>
    </div>
  );
};

export default Home;
