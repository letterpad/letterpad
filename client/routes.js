import React from "react";
import { Route, IndexRoute } from "react-router";
import {
    App,
    Home,
    Search,
    Single,
    OneColLayout,
    TwoColLayout
} from "./containers";
export default (
    <Route path="/" component={App}>
        <IndexRoute component={OneColLayout(Home)} />
        <Route path="/home" component={OneColLayout(Home)} />
        <Route path="/post/:permalink" component={OneColLayout(Single)} />
        <Route
            path="/category/:query"
            component={OneColLayout(Search("category"))}
        />
        <Route path="/tag/:query" component={OneColLayout(Search("tag"))} />
        <Route path="/post/:query" component={OneColLayout(Search("post"))} />
    </Route>
);
