/*
  Import Dependencies
*/
//require('babel-register');
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import client from "./apolloClient";
import { ApolloProvider } from "react-apollo";
import createBrowserHistory from "history/lib/createBrowserHistory";
const history = createBrowserHistory();

import routes from "./routes";
import store from "./store";
// import "babel-polyfill";
function handleUpdate() {
    let {
        action
    } = this.state.location;

    if (action === "PUSH") {
        window.scrollTo(0, 0);
    }
}
/*
  Rendering
  This is where we hook up the Store with our actual component and the router
*/
render(
    <ApolloProvider client={client} store={store}>
        <Router
            onUpdate={handleUpdate}
            routes={routes}
            history={browserHistory}
        />
    </ApolloProvider>,
    document.getElementById("app")
);
