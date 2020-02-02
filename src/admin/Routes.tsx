// css
import "./public/pcss/admin.pcss";

import React, { Component, Fragment } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteComponentProps, withRouter } from "react-router";
import {
  Setting,
  SettingOptions,
  SettingsQuery,
} from "../__generated__/gqlTypes";

import Article from "./features/article";
import Articles from "./features/articles";
import Author from "./features/author";
import AuthorCreate from "./features/author/Create";
import AuthorList from "./features/author-list";
import CreateArticle from "./features/article/CreateArticle";
import Home from "./features/home";
import { I18nextProvider } from "react-i18next";
// View Files
import Loader from "./components/loader";
import LoginView from "./features/login/LoginView";
import Media from "./features/media";
import NavigationBuilder from "./features/navigation-builder";
import Notifications from "react-notify-toast";
import { QUERY_SETTINGS } from "../shared/queries/Queries";
import ResetPassword from "./features/login/ResetPassword";
// All files which require authorization will pass though this
import SecuredRoute from "./helpers/Secured";
import Settings from "./features/settings";
import StaticSite from "./features/static-site";
import Taxonomy from "./features/taxonomy";
import apolloClient from "../shared/apolloClient";
// Shared
import getI18nWithDefaultLang from "../shared/i18n/i18n";

type TypeSettings = { [option in SettingOptions]: Setting } | {};

interface IState {
  settings: TypeSettings | {};
  loading: boolean;
  error: any;
}

class Routes extends Component<RouteComponentProps, IState> {
  state = {
    settings: {},
    loading: true,
    error: null,
  };

  async componentDidMount() {
    try {
      const options = await apolloClient().query<SettingsQuery>({
        query: QUERY_SETTINGS,
      });
      const data: TypeSettings = {};
      if (options && options.data && options.data.settings) {
        options.data.settings.forEach(setting => {
          if (data && setting && setting.option) {
            data[setting.option] = setting;
          }
        });
        this.setState({ settings: data, loading: false });
      }
    } catch (e) {
      this.setState({ error: e, loading: false });
    }
  }

  render() {
    const { loading, error, settings } = this.state as IState;
    if (loading || !settings) {
      return <Loader />;
    }
    if (error) {
      console.log(error);
      return <div>{error}</div>;
    }
    const i18nConfig = getI18nConfig(settings);

    return (
      <I18nextProvider i18n={i18nConfig}>
        <Notifications />
        <Switch>
          <Route
            exact
            path="/admin"
            render={() => <Redirect to="/admin/login" />}
          />
          <Route
            exact
            path="/admin/login"
            render={props => <LoginView router={props} settings={settings} />}
          />
          <Route
            exact
            path="/admin/reset-password/:token"
            component={props => (
              <ResetPassword {...props} {...this.props} settings={settings} />
            )}
          />
          <Fragment>
            <SecuredRoute
              exact
              path="/admin/home"
              component={Home}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/post-new"
              type="post"
              component={CreateArticle}
              layout="none"
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/page-new"
              type="page"
              component={CreateArticle}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/posts"
              type="post"
              component={Articles}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/posts/:post_id"
              type="post"
              component={Article}
              layout="none"
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/pages"
              type="page"
              component={Articles}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/pages/:post_id"
              type="page"
              component={Article}
              layout="none"
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/tags"
              type="post_tag"
              component={Taxonomy}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/categories"
              type="post_category"
              component={Taxonomy}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/settings"
              component={Settings}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/navigation-builder"
              settings={settings}
              component={NavigationBuilder}
            />
            <SecuredRoute
              exact
              path="/admin/authors"
              component={AuthorList}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/authors/edit/:id"
              component={Author}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/edit-profile"
              component={Author}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/authors/new"
              component={AuthorCreate}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/static-site"
              component={StaticSite}
              settings={settings}
            />
            <SecuredRoute
              exact
              path="/admin/media"
              component={Media}
              settings={settings}
            />
          </Fragment>
        </Switch>
      </I18nextProvider>
    );
  }
}

export default withRouter(Routes);

function getI18nConfig(settings) {
  const langOptions = JSON.parse(settings.locale.value);
  const selectedLang = Object.keys(langOptions).filter(key => langOptions[key]);
  const lang = selectedLang[0];
  return getI18nWithDefaultLang(lang);
}
