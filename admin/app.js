/*
  Import Dependencies
*/
import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import client from "./apolloClient";
import App from "./containers/App";
import { lightBlue, green } from "material-ui/colors";
import SidebarWidgets from "./components/settings/SidebarWidgets";

/*
  Rendering
  This is where we hook up the Store with our actual component and the router

  // muiTheme={getMuiTheme(darkBaseTheme)}
*/
const theme = createMuiTheme({
    palette: {
        primary: lightBlue,
        secondary: green
    },
    status: {
        danger: "orange"
    },
    overrides: {
        MuiMenuItem: {
            root: {
                fontSize: "0.8rem",
                height: 10
            }
        },
        MuiToolbar: {
            root: {
                color: "#FFF"
            }
        },
        MuiButton: {
            root: {
                fontSize: 12,
                borderRadius: 0
            }
        },
        MuiCardHeader: {
            title: {
                fontSize: 17
            },
            subheader: {
                fontSize: "0.8rem",
                marginTop: 8
            }
        },
        MuiInput: {
            root: {
                fontSize: 13,
                color: "#555"
            }
        },
        MuiInputLabel: {
            root: {
                fontSize: 14
            },
            animated: {
                fontSize: 14
            },
            shrink: {
                fontSize: 20,
                transform: "translate(0, 1.5px) scale(0.85)"
            }
        }
    }
});
render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <MuiThemeProvider theme={theme}>
                <App />
            </MuiThemeProvider>
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById("app")
);
