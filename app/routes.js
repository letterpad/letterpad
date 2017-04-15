import React from "react";
import { Route, IndexRoute } from "react-router";
import {
    App,
    Home,
    LoginView,
    TwoColumnLayout,
    OneColumnLayout,
    List,
    Single,
    Create,
    Settings,
    Authors
} from "./containers";
export default (
    <Route path="/admin" component={App}>
        <IndexRoute component={LoginView} />
        <Route path="/admin/login" component={LoginView} />
        <Route path="/admin/posts" component={OneColumnLayout(List("post"))} />
        <Route path="/admin/pages" component={OneColumnLayout(List("page"))} />

        <Route
            path="/admin/post/:post_id"
            component={OneColumnLayout(Single("post"))}
        />
        <Route
            path="/admin/post-new"
            component={OneColumnLayout(Create("post"))}
        />
        <Route
            path="/admin/page/:post_id"
            component={OneColumnLayout(Single("page"))}
        />
        <Route
            path="/admin/page-new"
            component={OneColumnLayout(Create("post"))}
        />
        <Route path="/admin/settings" component={OneColumnLayout(Settings)} />
        <Route path="/admin/authors" component={OneColumnLayout(Authors)} />
    </Route>
);
