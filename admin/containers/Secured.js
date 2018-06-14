import React from "react";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import { Route, Redirect } from "react-router-dom";
import Layout from "../containers/Layout";

const SecuredRoute = routeProps => {
    try {
        let props = { ...routeProps };
        const Component = props.component;
        const user = jwtDecode(localStorage.token);
        let exact = true;
        if ("exact" in props) {
            exact = props.exact;
        }
        delete props.component;
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
    exact: PropTypes.bool
};
export default SecuredRoute;
