import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Logo from "./Logo";
import Menu from "../menu";
import { QUERY_STATS } from "../../../shared/queries/Queries";
import { RouteComponentProps } from "react-router";
import { StatsQuery } from "../../../__generated__/gqlTypes";
import StyledSidebar from "./Sidebar.css";
import ThemeSwitch from "../theme-switcher";
import { TypeSettings } from "../../../client/types";
import apolloClient from "../../../shared/apolloClient";

interface IProps {
  settings: TypeSettings;
  router: RouteComponentProps;
  setSearchMode: () => void;
}

let MEMO_STATS;
async function getStats() {
  const { loading, data } = await apolloClient().query({
    query: QUERY_STATS,
  });
  if (!loading && data) {
    return data;
  }
}

const Sidebar: React.FC<IProps> = props => {
  const { settings, router } = props;
  const [stats, setStats] = useState<StatsQuery>(MEMO_STATS);

  useEffect(() => {
    getStats().then(data => {
      if (JSON.stringify(data) !== JSON.stringify(MEMO_STATS)) {
        MEMO_STATS = data;
        setStats(data);
      }
    });
  }, []);

  if (!stats) return null;
  return (
    <StyledSidebar>
      <div className="sidebar-top">
        <Logo
          src={settings.site_logo.value}
          siteName={settings.site_title.value}
          setSearchMode={props.setSearchMode}
        />
        <Menu settings={settings} router={router} stats={stats} />
      </div>
      <ThemeSwitch />
      <div className="view-site">
        <Link target="_blank" rel="noopener noreferrer" to={"/"}>
          View site
        </Link>
      </div>
    </StyledSidebar>
  );
};

export default Sidebar;
