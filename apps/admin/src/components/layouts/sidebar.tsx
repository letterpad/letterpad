import { FC } from "react";

import { Stats } from "@/__generated__/__types__";

import { Logo } from "../login/views/Logo";
import ProfileInfo from "../profile-info";
import { SiteMenu } from "../site-menu";

interface Props {
  site_url: string;
  avatar?: string;
  stats: Stats | Record<string, unknown>;
  name: string;
}

export const Sidebar: FC<Props> = ({ avatar, site_url, stats, name }) => {
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
      <div style={{ paddingLeft: 24, padding: 20 }}>
        <Logo width={32} />
      </div>
      <SiteMenu stats={stats} />
      <ProfileInfo name={name} avatar={avatar} site_url={site_url} />
    </div>
  );
};
