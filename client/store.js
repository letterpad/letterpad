import { createStore, applyMiddleware, compose } from "redux";
import { syncHistoryWithStore } from "react-router-redux";
import { browserHistory, hashHistory } from "react-router";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
import client from "./apolloClient";

/*
  Store
  Redux apps have a single store which takes
  1. All Reducers which we combined into `rootReducer`
  2. An optional starting state - similar to React's getInitialState
*/
const initialState = window.__APOLLO_STATE__;

const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(thunk, client.middleware()),
        window && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

// we export history because we need it in `dashboard.js` to feed into <Router>
export const history = syncHistoryWithStore(hashHistory, store);

/*
  Enable Hot Reloading for the reducers
  We re-require() the reducers whenever any new code has been written.
  Webpack will handle the rest
*/

// if (module.hot) {
//     module.hot.accept("./redux/reducers/", () => {
//         const nextRootReducer = require("./redux/reducers").default;
//         store.replaceReducer(nextRootReducer);
//     });
// }

export default store;
