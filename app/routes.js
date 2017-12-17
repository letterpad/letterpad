import React from "react";
import { Route, IndexRoute } from "react-router";
import Menu from "./components/Menu";

import {
    App,
    Home,
    LoginView,
    TwoColumnLayout,
    OneColumnLayout,
    List,
    Posts,
    Media,
    Pages,
    Single,
    Create,
    Settings,
    Authors
} from "./containers";

function Authorized(WrappedComponent) {
    // ...and returns another component...
    return class extends React.Component {
        constructor(props) {
            super(props);
        }
        componentWillReceiveProps(nextProps) {
            if (!window.clientData.access) {
                document.location.href = "/admin/login";
            }
        }

        render() {
            // ... and renders the wrapped component with the fresh data!
            // Notice that we pass through any additional props
            return (
                <div>
                    <Menu />
                    <WrappedComponent {...this.props} />
                </div>
            );
        }
    };
}
export default (
    <Route path="/admin" component={App}>
        <IndexRoute component={LoginView} />
        <Route path="/admin/login" component={LoginView} />
        <Route path="/admin/posts/:page" component={Authorized(Posts)} />
        <Route path="/admin/pages/:page" component={Authorized(Pages)} />

        <Route
            path="/admin/post/:post_id"
            component={Authorized(Single("post"))}
        />
        <Route path="/admin/post-new" component={Authorized(Create("post"))} />
        <Route
            path="/admin/page/:post_id"
            component={Authorized(Single("page"))}
        />
        <Route path="/admin/page-new" component={Authorized(Create("post"))} />
        <Route path="/admin/media" component={Authorized(Media)} />
        <Route path="/admin/settings" component={Authorized(Settings)} />
        <Route path="/admin/authors" component={Authorized(Authors)} />
    </Route>
);
