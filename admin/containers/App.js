import React from "react";
import { graphql } from "react-apollo";
import { Route, Switch } from "react-router-dom";
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
                    component={props => <Menu {...props} {...data} />}
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
                    path="/admin/posts/:post_id"
                    component={props => <Edit {...props} type="post" />}
                />
                <Route
                    path="/admin/post-new"
                    component={props => <Create {...props} type="post" />}
                />
                <Route
                    exact
                    path="/admin/tags"
                    component={props => <Taxonomy {...props} type="post_tag" />}
                />
                <Route
                    exact
                    path="/admin/categories"
                    component={props => (
                        <Taxonomy {...props} type="post_category" />
                    )}
                />
                {/* Route for pages */}
                <Route exact path="/admin/pages" component={Pages} />
                <Route
                    path="/admin/pages/:post_id"
                    component={props => <Edit {...props} type="page" />}
                />
                <Route
                    path="/admin/page-new"
                    component={props => <Create {...props} type="page" />}
                />
                {/* Route for others */}
                <Route path="/admin/media" component={Media} />
                <Route
                    path="/admin/menu-builder"
                    component={props => (
                        <MenuBuilder {...props} settings={data.settings} />
                    )}
                />

                <Route exact path="/admin/authors" component={Authors} />
                <Route
                    exact
                    path="/admin/authors/new"
                    component={props => (
                        <CreateAuthor {...props} author={user} />
                    )}
                />
                <Route path="/admin/authors/edit/:id" component={EditAuthor} />
                <Route
                    path="/admin/edit-profile"
                    component={props => <EditAuthor {...props} author={user} />}
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

export default ContainerWithSiteData(App);
