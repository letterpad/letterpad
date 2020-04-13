import { Redirect, Route } from "react-router-dom";

import Layout from "../features/layout";
import React from "react";
import jwtDecode from "jwt-decode";

const SecuredRoute: React.FC<any> = (routeProps: any) => {
  try {
    const { settings, component, type, path, exact, layout } = routeProps;
    const props = { exact, settings, type, path, layout };
    const Component = component;

    // decode the token and get all user info. This will be passed to all compnents as a prop
    const user = jwtDecode(localStorage.token);

    return (
      <Route
        {...props}
        render={router => {
          return <Component {...props} author={user} router={router} />;
        }}
      />
    );
  } catch (e) {
    // security failure
  }
  return <Redirect to={"/admin/login"} />;
};

export default SecuredRoute;
