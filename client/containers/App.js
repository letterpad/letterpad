import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { gql, graphql } from "react-apollo";

import Loader from "../components/Loader";
import TwoColLayout from "./TwoColLayout";
import Home from "./Home";
import Posts from "./Posts";
import Page from "./Page";
import Single from "./Single";
import SearchWrapper from "./SearchWrapper";

require("../../public/scss/client.scss");

class App extends Component {
    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        return (
            <div>
                <Switch>
                    <Route
                        exact
                        path="/"
                        component={TwoColLayout(<Home {...this.props} />)}
                    />
                    <Route
                        path="/posts/:slug"
                        component={TwoColLayout(<Posts {...this.props} />)}
                    />
                    <Route
                        path="/page/:slug"
                        component={TwoColLayout(<Page {...this.props} />)}
                    />
                    <Route
                        path="/post/:slug"
                        component={TwoColLayout(<Single {...this.props} />)}
                    />
                    <Route
                        path="/category/:query"
                        component={TwoColLayout(
                            <SearchWrapper {...this.props} type="category" />
                        )}
                    />
                </Switch>
            </div>
        );
    }
}

const optionsQuery = gql`
    query getOptions {
        settings {
            id
            option
            value
        }
    }
`;

const ContainerWithSiteData = graphql(optionsQuery, {
    props: ({ data: { loading, settings } }) => {
        const data = {};
        if (settings) {
            settings.forEach(setting => {
                data[setting.option] = setting;
            });
        }
        return {
            settings: data,
            loading
        };
    }
});

export default ContainerWithSiteData(App);
