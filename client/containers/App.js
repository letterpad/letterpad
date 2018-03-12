import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import { Helmet } from "react-helmet";
import SEO from "../components/SEO";
import Loader from "../components/Loader";

/*!------------------------------------------------------------------
[View Containers]
*/
import Home from "./Home";
import Posts from "./Posts";
import SinglePage from "./SinglePage";
import SinglePost from "./SinglePost";
import SearchWrapper from "./SearchWrapper";
import Layout from "../layouts/Layout";

/*!------------------------------------------------------------------
[Data Sources - Connected with Apollo]
*/
import PostsData from "../data-supply/PostsData";
import SinglePageData from "../data-supply/SinglePageData";
import SinglePostData from "../data-supply/SinglePostData";
import AdjacentPostsData from "../data-supply/AdjacentPostsData";
import SettingsData from "../data-supply/SettingsData";

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
        const { settings } = this.props;
        this.applyCustomCSS(settings);

        // const routes = [
        //     {
        //         exact: true,
        //         component: () => Layout(PostsData(Home), this.props),
        //         path: "/"
        //     },
        //     {
        //         exact: true,
        //         component: () => Layout(PostsData(Posts), this.props),
        //         path: "/posts/:slug"
        //     },
        //     {
        //         exact: true,
        //         component: () => Layout(SinglePageData(SinglePage), this.props),
        //         path: "/page/:slug"
        //     },
        //     {
        //         exact: true,
        //         component: () =>
        //             Layout(
        //                 AdjacentPostsData(SinglePostData(SinglePost)),
        //                 this.props
        //             ),
        //         path: "/post/:slug"
        //     },
        //     {
        //         exact: true,
        //         component: () =>
        //             Layout(SearchWrapper, {
        //                 ...this.props,
        //                 type: "category"
        //             }),
        //         path: "/category/:query"
        //     },
        //     {
        //         exact: true,
        //         component: () =>
        //             Layout(SearchWrapper, {
        //                 ...this.props,
        //                 type: "tag"
        //             }),
        //         path: "/tag/:query"
        //     },
        //     {
        //         exact: true,
        //         component: () =>
        //             Layout(SearchWrapper, {
        //                 ...this.props,
        //                 type: "post"
        //             }),
        //         path: "/search/:query"
        //     }
        // ];
        // const s = routes.map((route, i) => (
        //     <Route
        //         key={i}

        //         path={route.path}
        //         component={route.component()}
        //     />
        // ));
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
                    <Route
                        exact
                        component={Layout(PostsData(Home), this.props)}
                        path="/"
                    />

                    <Route
                        component={Layout(PostsData(Posts), this.props)}
                        path="/posts/:slug"
                    />

                    <Route
                        component={Layout(
                            SinglePageData(SinglePage),
                            this.props
                        )}
                        path="/page/:slug"
                    />

                    <Route
                        component={Layout(
                            AdjacentPostsData(SinglePostData(SinglePost)),
                            this.props
                        )}
                        path="/post/:slug"
                    />

                    <Route
                        component={Layout(SearchWrapper, {
                            ...this.props,
                            type: "category"
                        })}
                        path="/category/:query"
                    />

                    <Route
                        component={Layout(SearchWrapper, {
                            ...this.props,
                            type: "tag"
                        })}
                        path="/tag/:query"
                    />

                    <Route
                        component={Layout(SearchWrapper, {
                            ...this.props,
                            type: "post"
                        })}
                        path="/search/:query"
                    />
                </Switch>
            </div>
        );
    }
}

export default SettingsData(withRouter(App));
