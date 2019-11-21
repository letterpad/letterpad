/* eslint-disable no-unused-vars */
/* eslint-disable no-unreachable */
/* eslint-disable react/prop-types */
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Route, Redirect, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import Notifications from "react-notify-toast";
import { I18nextProvider } from "react-i18next";
import { hot } from "react-hot-loader";

// Shared
import getI18nWithDefaultLang from "../shared/i18n/i18n";

// View Files
import Loader from "./components/loader";
import LoginView from "./features/login/LoginView";
import ResetPassword from "./features/login/ResetPassword";
import ArticleList from "./features/article-list";
import ArticleCreate from "./features/article/Create";
import Article from "./features/article";
import Settings from "./features/settings";
import Media from "./features/media";
import AuthorList from "./features/author-list";
import Author from "./features/author";
import AuthorCreate from "./features/author/Create";
import Taxonomy from "./features/taxonomy";
import NavigationBuilder from "./features/navigation-builder";
import Home from "./features/home";
import Themes from "./features/themes";
import StaticSite from "./features/static-site";

// css
import "./public/pcss/admin.pcss";

// All files which require authorization will pass though this
import SecuredRoute from "./helpers/Secured";
import SettingsData from "../shared/data-connectors/SettingsData";

class Routes extends Component {
  static propTypes = {
    settings: PropTypes.object,
  };

  render() {
    const { loading, error, data } = this.props.settings;
    if (loading) {
      return <Loader />;
    }
    if (error) {
      window.location = "/admin/login";
      return;
    }

    const langOptions = JSON.parse(data.locale.value);
    const selectedLang = Object.keys(langOptions).filter(
      key => langOptions[key],
    );
    const lang = selectedLang[0];
    const i18nConfig = getI18nWithDefaultLang(lang);
    return (
      <I18nextProvider i18n={i18nConfig}>
        <Switch>
          <Route
            exact
            path="/admin"
            render={() => <Redirect to="/admin/login" />}
          />
          <Route
            exact
            path="/admin/login"
            render={props => <LoginView {...props} settings={data} />}
          />
          <Route
            exact
            path="/admin/reset-password/:token"
            component={props => (
              <ResetPassword {...props} {...this.props} settings={data} />
            )}
          />
          <Fragment>
            {/* Notifications can be trigerred from anywhere, but they will be rendered in this block*/}
            <Notifications />

            <SecuredRoute
              exact
              path="/admin/home"
              component={Home}
              settings={data}
            />
            {/* Route for posts */}
            <SecuredRoute
              exact
              path="/admin/post-new"
              type="post"
              component={ArticleCreate}
              layout="none"
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/posts"
              type="post"
              component={ArticleList}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/posts/:post_id"
              type="post"
              component={Article}
              layout="none"
              settings={data}
            />
            {/* Route for pages */}
            <SecuredRoute
              exact
              path="/admin/pages"
              type="page"
              component={ArticleList}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/pages/:post_id"
              type="page"
              component={Article}
              layout="none"
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/page-new"
              type="page"
              component={ArticleCreate}
              settings={data}
            />
            {/* Route for others */}
            <SecuredRoute
              exact
              path="/admin/tags"
              type="post_tag"
              component={Taxonomy}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/categories"
              type="post_category"
              component={Taxonomy}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/media"
              component={Media}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/media/:page"
              component={Media}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/authors"
              component={AuthorList}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/authors/edit/:id"
              component={Author}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/authors/new"
              component={AuthorCreate}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/edit-profile"
              component={Author}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/settings"
              component={Settings}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/themes"
              component={Themes}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/static-site"
              component={StaticSite}
              settings={data}
            />
            <SecuredRoute
              exact
              path="/admin/navigation-builder"
              settings={data}
              component={NavigationBuilder}
            />
          </Fragment>
        </Switch>
      </I18nextProvider>
    );
  }
}

export default hot(module)(SettingsData(withRouter(Routes)));
