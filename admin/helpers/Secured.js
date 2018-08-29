import React from "react";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import { Route, Redirect } from "react-router-dom";

import Layout from "../features/layout";
// import NoLayout from "../features/layout/NoLayout";

const SecuredRoute = routeProps => {
    try {
        let props = { ...routeProps };
        const Component = props.component;

        // decode the token and get all user info. This will be passed to all compnents as a prop
        const user = jwtDecode(localStorage.token);

        // check if this exact or not
        let exact = true;
        if ("exact" in props) {
            exact = props.exact;
        }
        // delete the component from props. Ito had to be wrapped with the Layout component
        delete props.component;
        // const LayoutType = props.layout == "none" ? NoLayout : Layout;
        return (
            <Route
                {...props}
                exact={exact}
                component={Layout(Component, { ...props, author: user })}
            />
        );
    } catch (e) {
        // security failure
    }
    return <Redirect to={"/admin/login"} />;
};

SecuredRoute.propTypes = {
    component: PropTypes.func.isRequired,
    exact: PropTypes.bool,
    layout: PropTypes.string
};

export default SecuredRoute;
