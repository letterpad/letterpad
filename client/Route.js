import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { Helmet } from "react-helmet";
import SEO from "./helpers/SEO";
import Loader from "./helpers/Loader";

// Data supply
import SettingsData from "../shared/data-connectors/SettingsData";

/*!------------------------------------------------------------------
[View Containers-]
*/
import Home from "./containers/Home";
import Posts from "./containers/Posts";
import SinglePage from "./containers/SinglePage";
import SinglePost from "./containers/SinglePost";
import SearchWrapper from "./containers/SearchWrapper";
import Layout from "./containers/Hoc/Layout";

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
        if (this.props.settings.loading) {
            return <Loader />;
        }
        const settings = this.props.settings.data;
        this.applyCustomCSS(settings);

        const routes = [
            {
                exact: true,
                component: Layout(Home, { settings }, "Home"),
                path: "/"
            },
            {
                exact: true,
                component: Layout(Posts, { settings }, "Posts"),
                path: "/posts/:slug"
            },
            {
                exact: true,
                component: Layout(
                    SinglePage,
                    {
                        settings
                    },
                    "SinglePage"
                ),
                path: "/page/:slug"
            },
            {
                exact: true,
                component: Layout(
                    SinglePost,
                    {
                        settings
                    },
                    "SinglePost"
                ),
                path: "/post/:slug"
            },
            {
                exact: true,
                component: Layout(
                    SearchWrapper,
                    {
                        type: "category",
                        settings
                    },
                    "SearchWrapper"
                ),
                path: "/category/:query"
            },
            {
                exact: true,
                component: Layout(
                    SearchWrapper,
                    {
                        type: "tag",
                        settings
                    },
                    "SearchWrapper"
                ),
                path: "/tag/:query"
            },
            {
                exact: true,
                component: Layout(
                    SearchWrapper,
                    {
                        type: "post",
                        settings
                    },
                    "SearchWrapper"
                ),
                path: "/search/:query"
            }
        ];

        return (
            <div>
                <SEO
                    schema="Blog"
                    title={`${settings.site_title.value} | ${
                        settings.site_tagline.value
                    }`}
                    description={settings.site_description.value}
                    path="/"
                    image="/"
                    contentType="blog"
                    settings={settings}
                />
                <Switch>
                    {routes.map((route, i) => (
                        <Route
                            key={i}
                            exact
                            path={route.path}
                            component={route.component}
                        />
                    ))}
                </Switch>
            </div>
        );
    }
}

export default SettingsData(withRouter(App));
