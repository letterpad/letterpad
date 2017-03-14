import React from "react";
import ReactDOM from "react-dom/server";
//import Helmet from 'react-helmet';
import { match, RouterContext } from "react-router";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApolloProvider } from "react-apollo";
import { createStore, applyMiddleware, compose } from "redux";

import prefetchComponentData from "../utils/prefetchComponentData";
import config from "../config/config";
import routes from "./routes";
import { doLogin } from "./api/actions";
import client from "./apolloClient";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";

var initialState = {};
const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(thunk, client.middleware()))
);

module.exports.init = app => {
/*----------------------------------------------
 * For generating a password, we would do this
 *----------------------------------------------
    //-----------Generate salt----------------
    var saltRounds = 10;

    /* Hash the password with the salt
     * and store this hash in the db
     * - This can be done in one single line

    bcrypt.hash("hellofresh", saltRounds, function(err, hash) {
      // Store hash in your password DB.
      //$2a$10$.dPLmaFVW2jTF/rMcUPRjucno5oKMwVMGeTjrPGDVinSQtPNy9Mdy
    });
------------------------------------------------*/

    app.post("/admin/doLogin", (req, res) => {
        doLogin({ username: req.body.username }).then(result => {
            if (result.code == 400) {
                res.sendStatus(result.code);
            }
            if (!result.data) {
                res.status(403).json({
                    code: 403,
                    msg: "Invalid credentials"
                });
            }

            bcrypt.compare(req.body.password, result.data.password, function(
                err,
                response
            ) {
                if (response) {
                    let token = jwt.sign(
                        {
                            username: req.body.username
                        },
                        "some-secret-to-be-kept-secret" //secret
                    );

                    req.session.token = token;
                    res.status(200).json({
                        code: 200,
                        msg: "Authentication Successfull"
                    });
                } else {
                    res.status(403).json({
                        code: 403,
                        msg: "Invalid credentials"
                    });
                }
            });
        });
    });

    app.get("/admin/*", (req, res) => {
        match({ routes, location: req.url }, (
            error,
            redirectLocation,
            renderProps
        ) => {
            if (error) {
                res.status(500).send(error.message);
            } else if (redirectLocation) {
                res.redirect(
                    302,
                    redirectLocation.pathname + redirectLocation.search
                );
            } else if (renderProps) {
                prefetchComponentData(
                    store.dispatch,
                    renderProps.components,
                    renderProps.params
                )
                    .then(renderHTML)
                    .then(html => res.status(200).send(html))
                    .catch(err => res.end(err.message));
            } else {
                res.status(404).send("Not found");
            }

            function renderHTML() {
                const initialState = store.getState();

                const renderedComponent = ReactDOM.renderToString(
                    <ApolloProvider store={store} client={client}>
                        <RouterContext {...renderProps} />
                    </ApolloProvider>
                );

                //let head = Helmet.rewind();
                var bundle = process.env.NODE_ENV == "production"
                    ? "/js/app-admin-bundle.js"
                    : "/static/app-admin-bundle.js";
                const HTML = `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">

                <link rel="stylesheet" href="http://bootswatch.com/cosmo/bootstrap.min.css">
                <link rel="stylesheet" href="http://dev.ajadmin/styles/custom.css">
                <link rel="stylesheet" href="/css/style.css">
              </head>
              <body id='dashboard' class='nav-md'>
                <div class='container body'>
                    <div id="app" class='main_container'>${renderedComponent}</div>
                </div>
                <script type="application/javascript">
                   window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
                   window.__CONFIG__ =  ${JSON.stringify(config)}
                </script>
                <script type="text/javascript" src='/tinymce/js/tinymce/tinymce.min.js'></script>
                <script src="${bundle}"></script>
              </body>
            </html>
        `;

                return HTML;
            }
        });
    });
};
