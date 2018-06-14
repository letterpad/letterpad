import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Redirect, Switch } from "react-router-dom";
import { withRouter } from "react-router";

import Notifications from "react-notify-toast";

// Shared
import Translate from "../shared/i18n/Translate";
import * as language from "../shared/i18n/lang";
import SettingsData from "../shared/data-connectors/SettingsData";

// View Files
import Loader from "./components/Loader";
import LoginView from "./containers/Login/LoginView";
import ResetPassword from "./containers/Login/ResetPassword";
import Settings from "./containers/Settings/Settings";
import Posts from "./containers/Post/Posts";
import Pages from "./containers/Page/Pages";
import Edit from "./containers/Edit/Edit";
import Create from "./containers/Create/Create";
import Media from "./containers/Media/Media";
import Authors from "./containers/Author/Authors";
import EditAuthor from "./containers/Author/EditAuthor";
import CreateAuthor from "./containers/Author/CreateAuthor";
import Taxonomy from "./containers/Post/Taxonomy";
import MenuBuilder from "./containers/Settings/MenuBuilder";
import Home from "./containers/Home/Home";
import Themes from "./containers/Settings/Themes";

// css
import "./public/pcss/admin.pcss";
import SecuredRoute from "./containers/Secured";

class Routes extends Component {
    static propTypes = {
        settings: PropTypes.object
    };
    render() {
        const settings = this.props.settings;
        if (settings.loading) {
            return <Loader />;
        }
        const langOptions = JSON.parse(settings.data.locale.value);
        const selectedLang = Object.keys(langOptions).filter(
            key => langOptions[key]
        );
        const locale = language[selectedLang[0]];
        return (
            <Translate i18n={locale}>
                <Switch>
                    <Route
                        exact
                        path="/admin"
                        render={props => <Redirect to="/admin/login" />}
                    />
                    <Route
                        exact
                        path="/admin/login"
                        render={props => (
                            <LoginView {...props} settings={settings.data} />
                        )}
                    />
                    <Route
                        exact
                        path="/admin/reset-password/:token"
                        component={props => (
                            <ResetPassword
                                {...props}
                                {...this.props}
                                settings={settings.data}
                            />
                        )}
                    />
                    <div className="wrapper">
                        <Notifications />

                        <SecuredRoute
                            path="/admin/home"
                            component={Home}
                            settings={settings.data}
                        />
                        {/* Route for posts */}
                        <SecuredRoute
                            path="/admin/posts"
                            name="Posts"
                            component={Posts}
                            settings={settings.data}
                        />

                        <SecuredRoute
                            path="/admin/posts/:post_id"
                            component={Edit}
                            type="post"
                            settings={settings.data}
                        />
                        <SecuredRoute
                            path="/admin/post-new"
                            type="post"
                            component={Create}
                            settings={settings.data}
                        />
                        <SecuredRoute
                            path="/admin/tags"
                            type="post_tag"
                            component={Taxonomy}
                            settings={settings.data}
                        />
                        <SecuredRoute
                            path="/admin/categories"
                            type="post_category"
                            component={Taxonomy}
                            settings={settings.data}
                        />
                        {/* Route for pages */}
                        <SecuredRoute
                            path="/admin/pages"
                            component={Pages}
                            settings={settings.data}
                        />
                        <SecuredRoute
                            path="/admin/pages/:post_id"
                            type="page"
                            component={Edit}
                            settings={settings.data}
                        />
                        <SecuredRoute
                            path="/admin/page-new"
                            type="page"
                            component={Create}
                            settings={settings.data}
                        />
                        {/* Route for others */}
                        <SecuredRoute
                            path="/admin/media"
                            component={Media}
                            settings={settings.data}
                        />
                        <SecuredRoute
                            path="/admin/media/:page"
                            component={Media}
                            settings={settings.data}
                        />
                        <SecuredRoute
                            path="/admin/menu-builder"
                            settings={settings.data}
                            component={MenuBuilder}
                        />

                        <SecuredRoute
                            path="/admin/authors"
                            component={Authors}
                            settings={settings.data}
                        />
                        <SecuredRoute
                            path="/admin/authors/new"
                            component={CreateAuthor}
                            settings={settings.data}
                        />
                        <SecuredRoute
                            path="/admin/authors/edit/:id"
                            component={EditAuthor}
                            settings={settings.data}
                        />
                        <SecuredRoute
                            path="/admin/edit-profile"
                            component={EditAuthor}
                            settings={settings.data}
                        />
                        <SecuredRoute
                            path="/admin/settings"
                            component={Settings}
                            settings={settings.data}
                        />
                        <SecuredRoute
                            path="/admin/themes"
                            component={Themes}
                            settings={settings.data}
                        />
                    </div>
                </Switch>
            </Translate>
        );
    }
}
export default SettingsData(withRouter(Routes));
