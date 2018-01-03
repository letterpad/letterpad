/*
  Import Dependencies
*/
import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import client from "./apolloClient";
import App from "./containers/App";

/*
  Rendering
  This is where we hook up the Store with our actual component and the router
*/
render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById("app")
);
