import React from "react";
import { graphql } from "react-apollo";
import { Route, Switch, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import jwtDecode from "jwt-decode";
import Notifications, { notify } from "react-notify-toast";
import Translate from "../../shared/i18n/Translate";
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
import * as language from "../../shared/i18n/lang";

const SecuredRoute = ({ component: Component, ...rest }) => {
    try {
        const user = jwtDecode(localStorage.token);
        let exact = true;
        if ("exact" in rest) {
            exact = rest.exact;
        }
        return (
            <Route
                {...rest}
                exact={exact}
                render={props => (
                    <Component {...props} author={user} {...rest} />
                )}
            />
        );
    } catch (e) {
        // security failure
    }
    return <Redirect to="/admin/login" />;
};
const App = data => {
    if (data.loading) {
        return <Loader />;
    }
    const langOptions = JSON.parse(data.settings.locale.value);
    const selectedLang = Object.keys(langOptions).filter(
        key => langOptions[key]
    );
    const locale = language[selectedLang[0]];
    return (
        <Translate i18n={locale}>
            <Switch>
                <Route exact path="/admin/login" component={LoginView} />
                <div className="wrapper">
                    <Notifications />

                    <SecuredRoute
                        exact={false}
                        path="/admin"
                        component={Menu}
                        {...data}
                    />
                    <SecuredRoute path="/admin/home" component={Home} />
                    {/* Route for posts */}
                    <SecuredRoute
                        path="/admin/posts"
                        name="Posts"
                        component={Posts}
                    />

                    <SecuredRoute
                        path="/admin/posts/:post_id"
                        component={Edit}
                        type="post"
                    />
                    <SecuredRoute
                        path="/admin/post-new"
                        type="post"
                        component={Create}
                    />
                    <SecuredRoute
                        path="/admin/tags"
                        type="post_tag"
                        component={Taxonomy}
                    />
                    <SecuredRoute
                        path="/admin/categories"
                        type="post_category"
                        component={Taxonomy}
                    />
                    {/* Route for pages */}
                    <SecuredRoute path="/admin/pages" component={Pages} />
                    <SecuredRoute
                        path="/admin/pages/:post_id"
                        type="page"
                        component={Edit}
                    />
                    <SecuredRoute
                        path="/admin/page-new"
                        type="page"
                        component={Create}
                    />
                    {/* Route for others */}
                    <SecuredRoute path="/admin/media" component={Media} />
                    <SecuredRoute path="/admin/media/:page" component={Media} />
                    <SecuredRoute
                        path="/admin/menu-builder"
                        settings={data.settings}
                        component={MenuBuilder}
                    />

                    <SecuredRoute path="/admin/authors" component={Authors} />
                    <SecuredRoute
                        path="/admin/authors/new"
                        render={CreateAuthor}
                    />
                    <SecuredRoute
                        path="/admin/authors/edit/:id"
                        component={EditAuthor}
                    />
                    <SecuredRoute
                        path="/admin/edit-profile"
                        component={EditAuthor}
                    />
                    <SecuredRoute path="/admin/settings" component={Settings} />
                    <SecuredRoute path="/admin/themes" component={Themes} />
                </div>
            </Switch>
        </Translate>
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
