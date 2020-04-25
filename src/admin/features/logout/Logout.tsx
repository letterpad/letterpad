import React, { useEffect } from "react";

import { RouteComponentProps } from "react-router";

const Logout: React.FC<{ router: RouteComponentProps }> = ({ router }) => {
  useEffect(() => {
    delete localStorage.token;
    router.history.push("/admin/login");
  }, []);

  return null;
};

export default Logout;
