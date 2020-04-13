import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteComponentProps, withRouter } from "react-router";

import Article from "./features/article";
import Articles from "./features/articles";
import Author from "./features/author";
import AuthorCreate from "./features/author/Create";
import AuthorList from "./features/author-list";
import CreateArticle from "./features/article/CreateArticle";
import Home from "./features/home";
import { I18nextProvider } from "react-i18next";
import Loader from "./components/loader";
import LoginView from "./features/login/LoginView";
import Media from "./features/media";
import NavigationBuilder from "./features/settings/Navigation";
import Notifications from "react-notify-toast";
import ResetPassword from "./features/login/ResetPassword";
import SecuredRoute from "./helpers/Secured";
import { Setting } from "../__generated__/gqlTypes";
import Settings from "./features/settings";
import Taxonomy from "./features/taxonomy";
import { TwoColumnLayout } from "./features/layout";
import { fetchSettings } from "../api/fetchSettings";
import getI18nWithDefaultLang from "../shared/i18n/i18n";

const Routes: React.FC<RouteComponentProps> = router => {
  const [settings, setSettings] = useState<Setting>();

  const setFavicon = (src: string) => {
    const favicon: HTMLLinkElement | null = document.querySelector(
      "link[rel='icon']",
    );
    if (favicon) favicon.href = src;
  };

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await fetchSettings();
      setSettings(settings);
      setFavicon(settings.site_favicon.src);
    };
    loadSettings();
  }, []);

  if (!settings) {
    return <Loader />;
  }

  const i18nConfig = getI18nConfig(settings.locale || "");
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
            <ResetPassword {...props} {...router} settings={settings} />
          )}
        />
        <Switch>
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
            path="/admin/pages/:post_id"
            type="page"
            component={Article}
            layout="none"
            settings={settings}
          />
          <TwoColumnLayout settings={settings} router={router}>
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
              path="/admin/pages"
              type="page"
              component={Articles}
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
              path="/admin/media"
              component={Media}
              settings={settings}
            />
          </TwoColumnLayout>
        </Switch>
      </Switch>
    </I18nextProvider>
  );
};

export default withRouter(Routes);

function getI18nConfig(value) {
  const langOptions = JSON.parse(value);
  const selectedLang = Object.keys(langOptions).filter(key => langOptions[key]);
  const lang = selectedLang[0];
  return getI18nWithDefaultLang(lang);
}
