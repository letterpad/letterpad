import React from "react";
import { gql, graphql } from "react-apollo";
import { Route, Switch } from "react-router-dom";
import Loader from "../components/Loader";
import LoginView from "./LoginView";
import Settings from "./Settings";
import Posts from "./Posts";
import Pages from "./Pages";
import Single from "./Single";
import Create from "./Create";
import Media from "./Media";
import Authors from "./Authors";
import EditAuthor from "./EditAuthor";
import MenuBuilder from "./MenuBuilder";
import Menu from "../components/Menu";
import "../../public/scss/admin.scss";

const App = data => {
    if (data.loading) {
        return <Loader />;
    }
    return (
        <Switch>
            <Route exact path="/admin/login" component={LoginView} />
            <div className="wrapper">
                <Route
                    path="/admin"
                    component={props => <Menu {...props} {...data} />}
                />
                {/* Route for posts */}
                <Route
                    exact
                    path="/admin/posts"
                    name="Posts"
                    component={Posts}
                />
                <Route
                    path="/admin/posts/:post_id"
                    component={props => <Single {...props} type="post" />}
                />
                <Route
                    path="/admin/post-new"
                    component={props => <Create {...props} type="post" />}
                />
                {/* Route for pages */}
                <Route path="/admin/pages" component={Pages} />
                <Route
                    path="/admin/pages/:post_id"
                    component={props => <Single {...props} type="page" />}
                />
                <Route
                    path="/admin/page-new"
                    component={props => <Create {...props} type="page" />}
                />
                {/* Route for others */}
                <Route path="/admin/media" component={Media} />
                <Route path="/admin/menu-builder" component={MenuBuilder} />

                <Route exact path="/admin/authors" component={Authors} />
                <Route path="/admin/authors/edit/:id" component={EditAuthor} />
                <Route path="/admin/settings" component={Settings} />
            </div>
        </Switch>
    );
};

const optionsQuery = gql`
    query getOptions {
        settings {
            id
            option
            value
        }
    }
`;

const ContainerWithSiteData = graphql(optionsQuery, {
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
