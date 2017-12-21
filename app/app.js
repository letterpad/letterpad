/*
  Import Dependencies
*/
//require('babel-register');
import React from "react";
import { render } from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import client from "./apolloClient";
import { ApolloProvider } from "react-apollo";
import createBrowserHistory from "history/lib/createBrowserHistory";
const history = createBrowserHistory();

import routes from "./routes";

function handleUpdate() {
    let { action } = this.state.location;
    if (action === "PUSH") {
        window.scrollTo(0, 0);
    }
}
/*
  Rendering
  This is where we hook up the Store with our actual component and the router
*/
render(
    <ApolloProvider client={client}>
        <Router
            onUpdate={handleUpdate}
            routes={routes}
            history={browserHistory}
        />
    </ApolloProvider>,
    document.getElementById("app")
);
