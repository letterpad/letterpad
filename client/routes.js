import React from "react";
import { Route, IndexRoute } from "react-router";
import { App, Home, Search, Layout } from "./containers";
export default (
    <Route path="/" component={App}>
        <IndexRoute component={Layout(Home)} />
        <Route path="/home" component={Home} />
        <Route path="/category/:query" component={Layout(Search("category"))} />
        <Route path="/tag/:query" component={Layout(Search("tag"))} />
        <Route path="/post/:query" component={Layout(Search("post"))} />
    </Route>
);
