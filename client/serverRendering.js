import React from "react";
import ReactDOM from "react-dom/server";
import config from "../config/config";
import { match, RouterContext } from "react-router";
import { Provider } from "react-redux";
import routes from "./routes";
import prefetchComponentData from "../utils/prefetchComponentData";
import store from "./redux/createStore";
import Helmet from "react-helmet";

module.exports.init = app => {
    app.get("/*", (req, res) => {
        match(
            {
                routes,
                location: req.url
            },
            (error, redirectLocation, renderProps) => {
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
                        <Provider store={store}>
                            <RouterContext {...renderProps} />
                        </Provider>
                    );
                    let head = Helmet.rewind();
                    var bundle = process.env.NODE_ENV == "production"
                        ? "/js/client-bundle.js"
                        : "/static/client-bundle.js";

                    const HTML = `
                <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    ${head.title.toString()}
                    ${head.meta.toString()}
                    ${head.link.toString()}
                    <link rel="stylesheet" href="/css/bootstrap.min.css">
                    <link rel='stylesheet' href='/css/font-awesome.min.css' type='text/css' media='all'/>
                    <link rel="stylesheet" href="/css/style.css">
                  </head>
                  <body id="client">
                    <div id="app">${renderedComponent}</div>
                    <script type="application/javascript">
                       window.__INITIAL_STATE__ = ${JSON.stringify(
                        initialState
                    )};
                       window.__CONFIG__ =  ${JSON.stringify(config)}
                    </script>

                    <script async src="${bundle}"></script>
                  </body>
                </html>
            `;
                    return HTML;
                }
            }
        );
    });
};
