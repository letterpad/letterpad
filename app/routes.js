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
        <Route path="/admin/posts" component={List("post")} />
        <Route path="/admin/pages" component={List("page")} />

        <Route path="/admin/post/:post_id" component={Single("post")} />
        <Route path="/admin/post-new" component={Create("post")} />
        <Route path="/admin/page/:post_id" component={Single("page")} />
        <Route path="/admin/page-new" component={Create("post")} />
        <Route path="/admin/settings" component={Settings} />
        <Route path="/admin/authors" component={Authors} />
    </Route>
);
