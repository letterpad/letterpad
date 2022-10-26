import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
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

import { HomeQueryQuery } from "@/__generated__/queries/queries.graphql";

import { Brand } from "./brand";
import ProfileInfo from "../profile-info";

interface Props {
  settings?: HomeQueryQuery["settings"];
  me?: HomeQueryQuery["me"];
  stats?: HomeQueryQuery["stats"];
}

export const Sidebar: FC<Props> = ({ settings, stats, me }) => {
  const router = useRouter();
  const { setSidebarVisible, isMobileOrTablet } = useResponsiveLayout();
  const s = settings?.__typename === "Setting" ? settings : null;
  const _me = me?.__typename === "Author" ? me : null;
  const _stats = stats?.__typename === "Stats" ? stats : null;

  return (
    <div className="100vh">
      <Brand site_name={s?.site_title ?? ""} />
      <div className="sidebar-content px-4 py-6">
        <Menu
          onSelect={(key) => {
            if (key === "/logout") {
              signOut({
                redirect: true,
              });
            }
            isMobileOrTablet && setSidebarVisible(false);
          }}
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
              badge: _stats?.posts?.published.toString(),
            },
            {
              label: "Pages",
              icon: <HiOutlineDocumentText />,
              key: "/pages",
              badge: _stats?.pages?.published.toString(),
            },
            {
              label: "Media",
              icon: <BsImages />,
              key: "/media",
              badge: _stats?.media?.toString(),
            },
            {
              label: "Tags",
              icon: <BsTags />,
              key: "/tags",
              badge: _stats?.tags?.toString(),
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
        name={_me?.name ?? ""}
        avatar={_me?.avatar}
        site_url={s?.site_url ?? ""}
      />
    </div>
  );
};
