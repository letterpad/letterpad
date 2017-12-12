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
    Single,
    Create,
    Settings,
    Authors
} from "./containers";

const Wrapper1 = Component => {
    return (
        <div>
            <Menu />
            <Component />
        </div>
    );
};
function Authorized(WrappedComponent) {
    // ...and returns another component...
    return class extends React.Component {
        constructor(props) {
            super(props);
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
        <Route path="/admin/posts" component={Authorized(List("post"))} />
        <Route path="/admin/pages" component={Authorized(List("page"))} />

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
        <Route path="/admin/settings" component={Authorized(Settings)} />
        <Route path="/admin/authors" component={Authorized(Authors)} />
    </Route>
);
