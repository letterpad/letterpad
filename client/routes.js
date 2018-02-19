import React, { Component } from "react";
import { Route, IndexRoute } from "react-router";
import {
    App,
    Posts,
    SearchWrapper,
    Single,
    Page,
    TwoColLayout
} from "./containers";

class Home extends Component {
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
        <Route exact path="/posts/:slug" component={TwoColLayout(Posts)} />
        <Route exact path="/page/:slug" component={TwoColLayout(Page)} />
        <Route exact path="/post/:slug" component={TwoColLayout(Single)} />
        <Route
            exact
            path="/tag/:query"
            component={TwoColLayout(<SearchWrapper type="tag" />)}
        />
        <Route
            exact
            path="/category/:query"
            component={TwoColLayout(<SearchWrapper type="category" />)}
        />
        <Route
            exact
            path="/search/:query"
            component={TwoColLayout(<SearchWrapper type="post" />)}
        />
    </Route>
);
