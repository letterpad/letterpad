import React, { Component } from "react";
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
import TopBar from "../components/TopBar";
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
                    <div className={exact ? "content-area" : ""}>
                        <TopBar author={user} />
                        <Component {...props} author={user} {...rest} />
                    </div>
                )}
            />
        );
    } catch (e) {
        // security failure
    }
    return <Redirect to="/admin/login" />;
};
class App extends Component {
    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        const langOptions = JSON.parse(this.props.settings.locale.value);
        const selectedLang = Object.keys(langOptions).filter(
            key => langOptions[key]
        );
        const locale = language[selectedLang[0]];
        return (
            <Translate i18n={locale}>
                <Switch>
                    <Route
                        exact
                        path="/admin/login"
                        render={props => (
                            <LoginView
                                {...props}
                                settings={this.props.settings}
                            />
                        )}
                    />
                    <div className="wrapper">
                        <Notifications />

                        <SecuredRoute
                            exact={false}
                            path="/admin"
                            component={Menu}
                            settings={this.props.settings}
                        />
                        <SecuredRoute path="/admin/home" component={Home} />
                        {/* Route for posts */}
                        <SecuredRoute
                            path="/admin/posts"
                            name="Posts"
                            component={Posts}
                            settings={this.props.settings}
                        />

                        <SecuredRoute
                            path="/admin/posts/:post_id"
                            component={Edit}
                            type="post"
                            settings={this.props.settings}
                        />
                        <SecuredRoute
                            path="/admin/post-new"
                            type="post"
                            component={Create}
                            settings={this.props.settings}
                        />
                        <SecuredRoute
                            path="/admin/tags"
                            type="post_tag"
                            component={Taxonomy}
                            settings={this.props.settings}
                        />
                        <SecuredRoute
                            path="/admin/categories"
                            type="post_category"
                            component={Taxonomy}
                            settings={this.props.settings}
                        />
                        {/* Route for pages */}
                        <SecuredRoute
                            path="/admin/pages"
                            component={Pages}
                            settings={this.props.settings}
                        />
                        <SecuredRoute
                            path="/admin/pages/:post_id"
                            type="page"
                            component={Edit}
                            settings={this.props.settings}
                        />
                        <SecuredRoute
                            path="/admin/page-new"
                            type="page"
                            component={Create}
                            settings={this.props.settings}
                        />
                        {/* Route for others */}
                        <SecuredRoute path="/admin/media" component={Media} />
                        <SecuredRoute
                            path="/admin/media/:page"
                            component={Media}
                            settings={this.props.settings}
                        />
                        <SecuredRoute
                            path="/admin/menu-builder"
                            settings={this.props.settings}
                            component={MenuBuilder}
                        />

                        <SecuredRoute
                            path="/admin/authors"
                            component={Authors}
                            settings={this.props.settings}
                        />
                        <SecuredRoute
                            path="/admin/authors/new"
                            component={CreateAuthor}
                            settings={this.props.settings}
                        />
                        <SecuredRoute
                            path="/admin/authors/edit/:id"
                            component={EditAuthor}
                            settings={this.props.settings}
                        />
                        <SecuredRoute
                            path="/admin/edit-profile"
                            component={EditAuthor}
                            settings={this.props.settings}
                        />
                        <SecuredRoute
                            path="/admin/settings"
                            component={Settings}
                            settings={this.props.settings}
                        />
                        <SecuredRoute path="/admin/themes" component={Themes} />
                    </div>
                </Switch>
            </Translate>
        );
    }
}
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
