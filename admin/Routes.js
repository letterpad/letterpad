import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Route, Redirect, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import Notifications from "react-notify-toast";
import { I18nextProvider } from "react-i18next";

// Shared
import getI18nWithDefaultLang from "../shared/i18n/i18n";
import SettingsData from "../shared/data-connectors/SettingsData";

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

class Routes extends Component {
  static propTypes = {
    settings: PropTypes.object,
  };

  render() {
    const settings = this.props.settings;
    if (settings.loading) {
      return <Loader />;
    }
    const langOptions = JSON.parse(settings.data.locale.value);
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
            render={props => <LoginView {...props} settings={settings.data} />}
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
          <Fragment>
            {/* Notifications can be trigerred from anywhere, but they will be rendered in this block*/}
            <Notifications />

            <SecuredRoute
              path="/admin/home"
              component={Home}
              settings={settings.data}
            />
            {/* Route for posts */}
            <SecuredRoute
              path="/admin/post-new"
              type="post"
              component={ArticleCreate}
              layout="none"
              settings={settings.data}
            />
            <SecuredRoute
              path="/admin/posts"
              type="post"
              component={ArticleList}
              settings={settings.data}
            />
            <SecuredRoute
              path="/admin/posts/:post_id"
              type="post"
              component={Article}
              layout="none"
              settings={settings.data}
            />
            {/* Route for pages */}
            <SecuredRoute
              path="/admin/pages"
              type="page"
              component={ArticleList}
              settings={settings.data}
            />
            <SecuredRoute
              path="/admin/pages/:post_id"
              type="page"
              component={Article}
              layout="none"
              settings={settings.data}
            />
            <SecuredRoute
              path="/admin/page-new"
              type="page"
              component={ArticleCreate}
              settings={settings.data}
            />
            {/* Route for others */}
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
              path="/admin/authors"
              component={AuthorList}
              settings={settings.data}
            />
            <SecuredRoute
              path="/admin/authors/edit/:id"
              component={Author}
              settings={settings.data}
            />
            <SecuredRoute
              path="/admin/authors/new"
              component={AuthorCreate}
              settings={settings.data}
            />
            <SecuredRoute
              path="/admin/edit-profile"
              component={Author}
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
            <SecuredRoute
              path="/admin/static-site"
              component={StaticSite}
              settings={settings.data}
            />
            <SecuredRoute
              path="/admin/navigation-builder"
              settings={settings.data}
              component={NavigationBuilder}
            />
          </Fragment>
        </Switch>
      </I18nextProvider>
    );
  }
}

export default SettingsData(withRouter(Routes));
