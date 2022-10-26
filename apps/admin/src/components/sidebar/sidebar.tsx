import { useRouter } from "next/router";
import { FC } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsEnvelope, BsImages, BsTags } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";
import {
  HiOutlineDocumentText,
  HiOutlineHome,
  HiOutlineUsers,
} from "react-icons/hi";

import { useResponsiveLayout } from "@/components_v2/layouts/responsiveProvider";
import { Menu } from "@/components_v2/menu";

import { Stats } from "@/__generated__/__types__";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";

import { Brand } from "./brand";
import ProfileInfo from "../profile-info";

interface Props {
  settings?: SettingsFragmentFragment;
  stats?: Stats;
}

export const Sidebar: FC<Props> = ({ settings, stats, me }) => {
  const router = useRouter();
  const { setSidebarVisible, isMobileOrTablet, sidebarVisible } =
    useResponsiveLayout();

  return (
    <div className="100vh">
      <Brand site_name={settings?.site_title ?? ""} />
      <div className="sidebar-content px-4 py-6">
        <Menu
          onSelect={() => isMobileOrTablet && setSidebarVisible(false)}
          selectedKey={router.pathname}
          items={[
            {
              label: "Dashboard",
              icon: <HiOutlineHome />,
              key: "/dashboard",
            },
            {
              label: "Posts",
              icon: <BsEnvelope />,
              key: "/posts",
              badge: stats?.posts.published.toString(),
            },
            {
              label: "Pages",
              icon: <HiOutlineDocumentText />,
              key: "/pages",
              badge: stats?.pages.published.toString(),
            },
            {
              label: "Media",
              icon: <BsImages />,
              key: "/media",
              badge: stats?.media.toString(),
            },
            {
              label: "Tags",
              icon: <BsTags />,
              key: "/tags",
              badge: stats?.tags.toString(),
            },
            {
              label: "Profile",
              icon: <CgProfile />,
              key: "/profile",
            },
            {
              group: "Site",
              label: "",
              key: "site",
            },
            {
              label: "Domain Mapping",
              icon: <CgProfile />,
              key: "/domain-mapping",
            },
            {
              label: "Settings",
              icon: <CiSettings />,
              key: "/settings",
            },
            {
              label: "Subscribers",
              icon: <HiOutlineUsers />,
              key: "/subscribers",
            },
            {
              label: "Logout",
              icon: <BiLogOut />,
              key: "/logout",
            },
          ]}
        />
      </div>
      <ProfileInfo
        name={me?.name}
        avatar={me.avatar}
        site_url={settings?.site_url ?? ""}
      />
    </div>
  );
};
