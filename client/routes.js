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
        <IndexRoute component={TwoColLayout(Home, true)} />
        <Route path="/posts/:query" component={TwoColLayout(Home)} />
        <Route path="/post/:permalink" component={TwoColLayout(Single)} />
        <Route
            path="/category/:query"
            component={TwoColLayout(Search("category"))}
        />
        <Route path="/tag/:query" component={TwoColLayout(Search("tag"))} />
        <Route path="/post/:query" component={TwoColLayout(Search("post"))} />
    </Route>
);
