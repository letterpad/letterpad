import React from "react";
import { graphql } from "react-apollo";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import jwtDecode from "jwt-decode";
import Notifications, { notify } from "react-notify-toast";
import Loader from "../components/Loader";
import LoginView from "./LoginView";
import Settings from "./Settings/Settings";
import Posts from "./Post/Posts";
import Pages from "./Page/Pages";
import Edit from "./Edit/Edit";
import Create from "./Create/Create";
import Media from "./Media/Media";
import Authors from "./Author/Authors";
import EditAuthor from "./Author/EditAuthor";
import CreateAuthor from "./Author/CreateAuthor";
import Taxonomy from "./Post/Taxonomy";
import MenuBuilder from "./Settings/MenuBuilder";
import Menu from "../components/Menu/Menu";
import Home from "./Home/Home";
import "../../public/scss/admin.scss";
import Themes from "./Settings/Themes";
import { GET_OPTIONS } from "../../shared/queries/Queries";

const App = data => {
    if (data.loading) {
        return <Loader />;
    }
    let user = {};
    if (typeof localStorage !== "undefined" && localStorage.token) {
        user = jwtDecode(localStorage.token);
    }
    return (
        <Switch>
            <Route exact path="/admin/login" component={LoginView} />

            <div className="wrapper">
                <div className="top-bar">
                    <div className="top-bar-left">Brand</div>
                    <div className="top-bar-right">Right</div>
                </div>
                <Notifications />

                <Route
                    path="/admin"
                    render={props => <Menu {...props} {...data} />}
                />
                <Route exact path="/admin/home" component={Home} />
                {/* Route for posts */}
                <Route
                    exact
                    path="/admin/posts"
                    name="Posts"
                    component={Posts}
                />
                <Route
                    exact
                    path="/admin/posts/:post_id"
                    render={props => <Edit {...props} type="post" />}
                />
                <Route
                    exact
                    path="/admin/post-new"
                    render={props => <Create {...props} type="post" />}
                />
                <Route
                    exact
                    path="/admin/tags"
                    render={props => <Taxonomy {...props} type="post_tag" />}
                />
                <Route
                    exact
                    path="/admin/categories"
                    render={props => (
                        <Taxonomy {...props} type="post_category" />
                    )}
                />
                {/* Route for pages */}
                <Route exact path="/admin/pages" component={Pages} />
                <Route
                    path="/admin/pages/:post_id"
                    render={props => <Edit {...props} type="page" />}
                />
                <Route
                    exact
                    path="/admin/page-new"
                    render={props => <Create {...props} type="page" />}
                />
                {/* Route for others */}
                <Route
                    exact
                    path="/admin/media"
                    render={props => <Media {...props} author={user} />}
                />
                <Route
                    exact
                    path="/admin/media/:page"
                    render={props => <Media {...props} author={user} />}
                />
                <Route
                    exact
                    path="/admin/menu-builder"
                    render={props => (
                        <MenuBuilder {...props} settings={data.settings} />
                    )}
                />

                <Route exact path="/admin/authors" component={Authors} />
                <Route
                    exact
                    path="/admin/authors/new"
                    render={props => <CreateAuthor {...props} author={user} />}
                />
                <Route path="/admin/authors/edit/:id" component={EditAuthor} />
                <Route
                    path="/admin/edit-profile"
                    render={props => <EditAuthor {...props} author={user} />}
                />
                <Route path="/admin/settings" component={Settings} />
                <Route path="/admin/themes" component={Themes} />
            </div>
        </Switch>
    );
};

const ContainerWithSiteData = graphql(GET_OPTIONS, {
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
