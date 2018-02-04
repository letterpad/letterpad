import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import { Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Notifications, { notify } from "react-notify-toast";
import Loader from "../components/Loader";
import LoginView from "./LoginView";
import Settings from "./Settings";
import Posts from "./Posts";
import Pages from "./Pages";
import Taxonomy from "./Taxonomy";
import Edit from "./Edit";
import Create from "./Create";
import Home from "./Home";
import Media from "./Media";
import Authors from "./Authors";
import EditAuthor from "./EditAuthor";
import CreateAuthor from "./CreateAuthor";
import MenuBuilder from "./MenuBuilder";
import Menu from "../components/Menu";
import author from "../../api/schema/author";
import Themes from "./Themes";
import withWidth, { LARGE, SMALL } from "material-ui/utils/withWidth";
import Header from "../components/Header";
import LeftDrawer from "../components/LeftDrawer";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import "../../public/scss/admin.scss";
import "../../public/scss/common.scss";
import { GET_OPTIONS } from "../../shared/queries/Queries";

const styles = theme => ({
    root: {
        width: "100%",
        height: "100vh",
        zIndex: 1,
        overflow: "hidden"
    },
    appFrame: {
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%"
    },
    content: {
        width: "100%",
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: 24,
        height: "calc(100% - 56px)",
        overflow: "scroll",
        marginTop: 56,
        [theme.breakpoints.up("sm")]: {
            height: "calc(100% - 64px)",
            marginTop: 64
        }
    }
});

class App extends Component {
    constructor(props) {
        super(props);
        this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
        this.state = {
            navDrawerOpen: true
        };
    }

    handleDrawerToggle() {
        this.setState({ navDrawerOpen: !this.state.navDrawerOpen });
    }

    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        let user = {};
        let { navDrawerOpen } = this.state;
        const paddingLeftDrawerOpen = 256;
        const { classes, theme } = this.props;

        if (typeof localStorage !== "undefined" && localStorage.token) {
            user = jwtDecode(localStorage.token);
        }

        return (
            <Switch>
                <Route exact path="/admin/login" component={LoginView} />

                <div className={classes.root}>
                    <div className={classes.appFrame}>
                        <Route
                            path="/admin"
                            component={props => (
                                <Header
                                    handleDrawerToggle={this.handleDrawerToggle}
                                    navDrawerOpen={this.state.navDrawerOpen}
                                    {...props}
                                />
                            )}
                        />
                        <Route
                            path="/admin"
                            component={props => (
                                <LeftDrawer
                                    handleDrawerToggle={this.handleDrawerToggle}
                                    navDrawerOpen={this.state.navDrawerOpen}
                                    styles={styles.header}
                                    {...props}
                                    user={user}
                                    settings={this.props.settings}
                                />
                            )}
                        />

                        <main className={classes.content}>
                            <Notifications />
                            <div noWrap>
                                <Route exact path="/admin" component={Home} />

                                {/* Route for posts */}
                                <Route
                                    exact
                                    path="/admin/posts"
                                    name="Posts"
                                    component={Posts}
                                />
                                <Route
                                    exact
                                    path="/admin/post-new"
                                    component={props => (
                                        <Create {...props} type="post" />
                                    )}
                                />
                                <Route
                                    exact
                                    path="/admin/tags"
                                    component={props => (
                                        <Taxonomy {...props} type="post_tag" />
                                    )}
                                />
                                <Route
                                    exact
                                    path="/admin/categories"
                                    component={props => (
                                        <Taxonomy
                                            {...props}
                                            type="post_category"
                                        />
                                    )}
                                />
                                <Route
                                    exact
                                    path="/admin/posts/:post_id"
                                    component={props => (
                                        <Edit {...props} type="post" />
                                    )}
                                />
                                {/* Route for pages */}
                                <Route
                                    exact
                                    path="/admin/pages"
                                    component={Pages}
                                />
                                <Route
                                    path="/admin/pages/:post_id"
                                    component={props => (
                                        <Edit {...props} type="page" />
                                    )}
                                />
                                <Route
                                    path="/admin/page-new"
                                    component={props => (
                                        <Create {...props} type="page" />
                                    )}
                                />
                                {/* Route for others */}
                                <Route path="/admin/media" component={Media} />
                                <Route
                                    path="/admin/menu-builder"
                                    component={props => (
                                        <MenuBuilder
                                            {...props}
                                            settings={this.props.settings}
                                        />
                                    )}
                                />

                                <Route
                                    exact
                                    path="/admin/authors"
                                    component={Authors}
                                />
                                <Route
                                    exact
                                    path="/admin/authors/new"
                                    component={props => (
                                        <CreateAuthor
                                            {...props}
                                            author={user}
                                        />
                                    )}
                                />
                                <Route
                                    path="/admin/authors/edit/:id"
                                    component={EditAuthor}
                                />
                                <Route
                                    path="/admin/edit-profile"
                                    component={props => (
                                        <EditAuthor {...props} author={user} />
                                    )}
                                />
                                <Route
                                    path="/admin/settings"
                                    component={Settings}
                                />
                                <Route
                                    path="/admin/themes"
                                    component={Themes}
                                />
                            </div>
                        </main>
                    </div>
                </div>
            </Switch>
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

export default withStyles(styles, { withTheme: true })(
    ContainerWithSiteData(withWidth()(App))
);
