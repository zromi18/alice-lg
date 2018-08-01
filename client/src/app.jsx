
/**
 * Alice (formerly known as Birdseye) v.2.0.0
 * ------------------------------------------
 *
 * @author Matthias Hannig <mha@ecix.net>
 */

import axios     from 'axios'

import React     from 'react'

import { Component } from 'react'

// Config
import { configureAxios } from './config'

// Content
import { contentUpdate } from './components/content/actions'

// Redux
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'

// Router
import createBrowserHistory from 'history/createBrowserHistory'
// import { Route, Switch } from 'react-router'

import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router'

// import { syncHistoryWithStore } from 'react-router-redux'


// Components
import LayoutMain from './layouts/main'


// Middlewares
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

// Reducer
import combinedReducer from 'reducer/app-reducer'



// Setup routing
const browserHistory = createBrowserHistory({
    basename: '/alice',
    forceRefresh: false,
    keyLength: 6,
    // getUserConfirmation: (message, callback) => callback(window.confirm(message))
});

// Create router middleware
// eslint-disable-next-line
const appRouterMiddleware = routerMiddleware();


// Setup application
const loggerMiddleware = createLogger();
const store = createStore(
  connectRouter(browserHistory)(combinedReducer),
  compose(
      applyMiddleware(
        loggerMiddleware,
        appRouterMiddleware,
        thunkMiddleware,
      )
  )
);


// Create extension endpoint:
window.Alice = {
  updateContent: (content) => {
    store.dispatch(contentUpdate(content));
  }
};

// Setup axios
configureAxios(axios);

// Create App
export default class AliceApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={browserHistory}>
          <LayoutMain />
        </ConnectedRouter>
      </Provider>
    );
  }
}
