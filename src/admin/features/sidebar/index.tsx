import React, { Component } from "react";

import Footer from "../footer";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import Menu from "../menu";
import { QUERY_STATS } from "../../../shared/queries/Queries";
import { RouteComponentProps } from "react-router";
import { StatsQuery } from "../../../__generated__/gqlTypes";
import StyledSidebar from "./Sidebar.css";
import { TypeSettings } from "../../../client/types";
import { useQuery } from "react-apollo";

interface IProps {
  settings: TypeSettings;
  router: RouteComponentProps;
}
const Sidebar: React.FC<IProps> = props => {
  const { settings, router } = props;
  const { loading, data } = useQuery<StatsQuery>(QUERY_STATS, {});

  if (loading) return null;
  return (
    <StyledSidebar>
      <div className="sidebar">
        <div className="sidebar-top">
          <Logo
            src={settings.site_logo.value}
            siteName={settings.site_title.value}
          />
          <Menu settings={settings} router={router} stats={data} />
        </div>
        <div className="view-site">
          <Link target="_blank" rel="noopener noreferrer" to={"/"}>
            View site
          </Link>
        </div>
        {/* <Footer data={settings.site_footer.value} /> */}
      </div>
    </StyledSidebar>
  );
};

export default Sidebar;
