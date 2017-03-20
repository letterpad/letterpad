import React from "react";
import { Route, IndexRoute } from "react-router";
import {
    App,
    Home,
    LoginView,
    TwoColumnLayout,
    PagesView,
    PostsView,
    SinglePostView,
    PostNewView,
    SinglePageView,
    PageNewView,
    MenuCreation
} from "./containers";
export default (
    <Route path="/admin" component={App}>
        <IndexRoute component={LoginView} />
        <Route path="/admin/login" component={LoginView} />
        <Route path="/admin/posts" component={TwoColumnLayout(PostsView)} />
        <Route path="/admin/pages" component={TwoColumnLayout(PagesView)} />
        <Route path="/admin/menu" component={TwoColumnLayout(MenuCreation)} />
        
        <Route
            name='SinglePostView'
            path="/admin/post/:post_id"
            component={TwoColumnLayout(SinglePostView)}
        />
        <Route
            path="/admin/post-new"
            component={TwoColumnLayout(PostNewView)}
        />
        <Route
            path="/admin/page/:page_id"
            component={TwoColumnLayout(SinglePageView)}
        />
        <Route
            path="/admin/page-new"
            component={TwoColumnLayout(PageNewView)}
        />
    </Route>
);
