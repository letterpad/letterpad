import React from "react";
import { Route, IndexRoute } from "react-router";
import EnsureLoggedInContainer from "./containers/EnsureLoggedInContainer";

import {
    App,
    Home,
    Connections,
    PostsView,
    LoginView,
    SinglePostView,
    TwoColumnLayout,
    PostNewView
} from "./containers";

export default (
    <Route path="/admin" component={App}>
        <IndexRoute component={LoginView} />
        <Route path="/admin/login" component={LoginView} />
        <Route path="/admin/posts" component={TwoColumnLayout(PostsView)} />
        <Route
            path="/admin/post/:post_id"
            component={TwoColumnLayout(SinglePostView)}
        />
        <Route
            path="/admin/post-new"
            component={TwoColumnLayout(PostNewView)}
        />
    </Route>
);
