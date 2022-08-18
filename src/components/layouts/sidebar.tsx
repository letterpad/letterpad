import { FC } from "react";

import { Stats } from "@/__generated__/__types__";

import Logo from "../Logo";
import ProfileInfo from "../profile-info";
import { SidebarMenu } from "../sidebar-menu";

interface Props {
  site_logo?: string;
  site_title: string;
  site_url: string;
  avatar?: string;
  stats: Stats | Record<string, unknown>;
  name: string;
}

export const Sidebar: FC<Props> = ({
  site_logo,
  site_title,
  avatar,
  site_url,
  stats,
  name,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        alignItems: "start",
        background: "rgb(var(--sidebar-bg))",
      }}
    >
      <div style={{ paddingLeft: 24 }}>
        {site_logo ? (
          <Logo src={site_logo} padding="16px 0px" height={46} />
        ) : (
          <h2>{site_title}</h2>
        )}
      </div>
      <SidebarMenu stats={stats} />
      <ProfileInfo name={name} avatar={avatar} site_url={site_url} />
    </div>
  );
};
