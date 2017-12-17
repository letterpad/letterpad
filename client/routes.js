import React, { Component } from "react";
import { Route, IndexRoute } from "react-router";
import {
    App,
    Posts,
    Search,
    Single,
    Page,
    OneColLayout,
    TwoColLayout
} from "./containers";

class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        //  so this is the homepage. Lets see what to display
        const menu = JSON.parse(this.props.settings.menu.value);
        const home = menu.filter(item => {
            if (item.label == "Home") return item;
        });

        if (this.props.route.path == "/") {
            if (home[0].type == "category") {
                return <Posts slug={home[0].slug} {...this.props} />;
            }
        }
        return <Page slug={home[0].slug} {...this.props} />;
    }
}

export default (
    <Route path="/" component={App}>
        <IndexRoute component={TwoColLayout(Home)} />
        <Route path="/posts/:query" component={TwoColLayout(Posts)} />
        <Route path="/page/:slug" component={TwoColLayout(Page)} />
        <Route path="/post/:slug" component={TwoColLayout(Single)} />
        <Route
            path="/category/:query"
            component={TwoColLayout(Search("category"))}
        />
        <Route path="/tag/:query" component={TwoColLayout(Search("tag"))} />
        <Route path="/post/:query" component={TwoColLayout(Search("post"))} />
    </Route>
);
