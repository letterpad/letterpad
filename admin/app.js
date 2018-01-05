/*
  Import Dependencies
*/
import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import client from "./apolloClient";
import App from "./containers/App";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";

/*
  Rendering
  This is where we hook up the Store with our actual component and the router

  // muiTheme={getMuiTheme(darkBaseTheme)}
*/
render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <MuiThemeProvider>
                <App />
            </MuiThemeProvider>
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById("app")
);
