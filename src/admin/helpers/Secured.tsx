import { Redirect, Route } from "react-router-dom";

import Layout from "../features/layout";
import React from "react";
import jwtDecode from "jwt-decode";

const SecuredRoute: React.SFC<any> = (routeProps: any) => {
  try {
    const { settings, component, type, path, exact, layout } = routeProps;
    const props = { exact, settings, type, path, layout };
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

export default SecuredRoute;
