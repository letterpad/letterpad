import React from "react";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import { Route, Redirect } from "react-router-dom";
// import { withRouter } from "react-router";
import Layout from "../features/layout";
// import NoLayout from "../features/layout/NoLayout";

const SecuredRoute = routeProps => {
  try {
    const { settings, component, type, path, exact, layout } = routeProps;
    let props = { exact, settings, type, path, layout };
    const Component = component;

    // decode the token and get all user info. This will be passed to all compnents as a prop
    const user = jwtDecode(localStorage.token);

    return (
      <Route
        {...props}
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
  layout: PropTypes.string,
};

export default SecuredRoute;
