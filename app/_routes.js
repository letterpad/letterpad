import React from "react";
import { Route, IndexRoute } from "react-router";
// import Breadcrumbs from "react-router-breadcrumbs";
import Notifications, { notify } from "react-notify-toast";
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
    Authors,
    EditAuthor,
    MenuBuilder
} from "./containers";

function Authorized(WrappedComponent) {
    // ...and returns another component...
    return class extends React.Component {
        getComponentName() {
            let name =
                WrappedComponent.displayName ||
                WrappedComponent.name ||
                (typeof WrappedComponent === "string" &&
                WrappedComponent.length > 0
                    ? WrappedComponent
                    : "Unknown");

            //  The name might contain brackets, eg Apollo(pages).
            //  Lets get rid of Apollo
            const matches = name.match(/\((.*?)\)/);

            if (matches) {
                name = matches[1];
            }
            return name.toLowerCase();
        }

        render() {
            const ComponentName = this.getComponentName();
            return (
                <div>
                    <Menu {...this.props} />
                    <div className={"wrapper " + ComponentName}>
                        <Notifications />
                        <WrappedComponent {...this.props} />
                        <div className="col-lg-12 text-center m-b-20">
                            <footer id="footer">
                                Thank you for creating with{" "}
                                <a href="https://ajaxtown.com" target="_blank">
                                    Ajaxtown
                                </a>&nbsp;·&nbsp;v3.4.2
                            </footer>
                        </div>
                    </div>
                </div>
            );
        }
    };
}
export default (
    <Route path="/admin" component={App}>
        <IndexRoute component={LoginView} />
        <Route path="/admin/login" component={LoginView} />
        <Route path="/admin/posts" name="Posts" component={Authorized(Posts)} />
        <Route path="/admin/pages" component={Authorized(Pages)} />

        <Route
            path="/admin/post/:post_id"
            component={Authorized(Single("post"))}
        />
        <Route path="/admin/post-new" component={Authorized(Create("post"))} />
        <Route
            path="/admin/page/:post_id"
            component={Authorized(Single("page"))}
        />
        <Route path="/admin/page-new" component={Authorized(Create("page"))} />
        <Route path="/admin/media" component={Authorized(Media)} />
        <Route path="/admin/menu-builder" component={Authorized(MenuBuilder)} />
        <Route path="/admin/settings" component={Authorized(Settings)} />
        <Route path="/admin/authors" component={Authorized(Authors)} />
        <Route
            path="/admin/authors/edit/:id"
            component={Authorized(EditAuthor)}
        />
    </Route>
);
