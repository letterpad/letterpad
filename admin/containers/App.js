import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import { Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Notifications, { notify } from "react-notify-toast";
import RaisedButton from "material-ui/RaisedButton";
import Loader from "../components/Loader";
import LoginView from "./LoginView";
import Settings from "./Settings";
import Posts from "./Posts";
import Pages from "./Pages";
import Edit from "./Edit";
import Create from "./Create";
import Media from "./Media";
import Authors from "./Authors";
import EditAuthor from "./EditAuthor";
import CreateAuthor from "./CreateAuthor";
import MenuBuilder from "./MenuBuilder";
import Menu from "../components/Menu";
import "../../public/scss/admin.scss";
import author from "../../api/schema/author";
import Themes from "./Themes";
import withWidth, { LARGE, SMALL } from "material-ui/utils/withWidth";
import Header from "../components/Header";
import LeftDrawer from "../components/LeftDrawer";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navDrawerOpen: this.props.width === LARGE
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.width !== nextProps.width) {
            this.setState({ navDrawerOpen: nextProps.width === LARGE });
        }
    }

    handleChangeRequestNavDrawer() {
        this.setState({
            navDrawerOpen: !this.state.navDrawerOpen
        });
    }
    render() {
        if (this.props.loading) {
            return <Loader />;
        }
        let user = {};
        let { navDrawerOpen } = this.state;
        const paddingLeftDrawerOpen = 256;

        const styles = {
            header: {
                paddingLeft: navDrawerOpen ? paddingLeftDrawerOpen : 0
            },
            container: {
                margin: "110px 40px 60px 40px",
                paddingLeft:
                    navDrawerOpen && this.props.width !== SMALL
                        ? paddingLeftDrawerOpen
                        : 0
            }
        };
        if (typeof localStorage !== "undefined" && localStorage.token) {
            user = jwtDecode(localStorage.token);
        }

        return (
            <Switch>
                <Route exact path="/admin/login" component={LoginView} />

                <div className="">
                    <Route
                        path="/admin"
                        component={props => (
                            <Header
                                styles={styles.header}
                                handleChangeRequestNavDrawer={this.handleChangeRequestNavDrawer.bind(
                                    this
                                )}
                            />
                        )}
                    />

                    <Route
                        path="/admin"
                        component={props => (
                            <LeftDrawer
                                navDrawerOpen={navDrawerOpen}
                                {...this.props}
                                {...props}
                                username="User Admin"
                            />
                        )}
                    />

                    <Notifications />
                    <div style={styles.container}>
                        {/*<Route
                        path="/admin"
                        component={props => <Menu {...props} {...data} />}
                />*/}
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
                            component={props => (
                                <Create {...props} type="post" />
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
                            component={props => (
                                <Create {...props} type="page" />
                            )}
                        />
                        {/* Route for others */}
                        <Route path="/admin/media" component={Media} />
                        <Route
                            path="/admin/menu-builder"
                            component={MenuBuilder}
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
                                <CreateAuthor {...props} author={user} />
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
                        <Route path="/admin/settings" component={Settings} />
                        <Route path="/admin/themes" component={Themes} />
                    </div>
                </div>
            </Switch>
        );
    }
}

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

export default ContainerWithSiteData(withWidth()(App));
