/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Home from 'pages/Home';
import NotFoundPage from 'pages/NotFoundPage';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="" component={NotFoundPage} />
      </Switch>
    </Router>
  );
}
