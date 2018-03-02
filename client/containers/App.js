import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { gql, graphql } from "react-apollo";
import { withRouter } from "react-router";
import Loader from "../components/Loader";
import TwoColLayout from "./TwoColLayout";
import Home from "./Home";
import Posts from "./Posts";
import Page from "./Page";
import Single from "./Single";
import SearchWrapper from "./SearchWrapper";

require("../../public/scss/client.scss");

class App extends Component {
    constructor(props) {
        super(props);
        this.applyCustomCSS = this.applyCustomCSS.bind(this);
    }

    componentDidMount() {
        const bc = new BroadcastChannel("test_channel");
        bc.onmessage = params => {
            const { property, color } = params.data;
            document.querySelector(":root").style.setProperty(property, color);
        };
    }

    applyCustomCSS({ css, colors }) {
        if (typeof document == "undefined") return false;
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.innerText = css.value;
        document.head.appendChild(style);
        const parsedColors = JSON.parse(colors.value);
        Object.keys(parsedColors).forEach(property => {
            document
                .querySelector(":root")
                .style.setProperty(property, parsedColors[property]);
        });
    }

    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        this.applyCustomCSS(this.props.settings);
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
                    <Route
                        path="/tag/:query"
                        component={TwoColLayout(
                            <SearchWrapper {...this.props} type="tag" />
                        )}
                    />
                    <Route
                        path="/search/:query"
                        component={TwoColLayout(
                            <SearchWrapper {...this.props} type="post" />
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

export default ContainerWithSiteData(withRouter(App));
