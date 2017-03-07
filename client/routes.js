import React from "react";
import { Route, IndexRoute } from "react-router";
import { App, Home, PostView, TwoColumnLayout } from "./containers";

export default (
    <Route path="/" component={App}>
        <IndexRoute component={(Home)} />
        <Route path="/:type/:post" component={TwoColumnLayout(PostView)} />
        <Route path="/:page" component={TwoColumnLayout(PostView)} />
    </Route>
);
