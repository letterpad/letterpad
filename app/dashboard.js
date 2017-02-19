/*
  Import Dependencies
*/
//require('babel-register');
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import createBrowserHistory from 'history/lib/createBrowserHistory'
const history = createBrowserHistory();

import routes from './routes';
import store from './redux/createStore';
import 'babel-polyfill';

/*
  Rendering
  This is where we hook up the Store with our actual component and the router
*/
render(
  <Provider store={store}>
      <Router routes={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('app')
);