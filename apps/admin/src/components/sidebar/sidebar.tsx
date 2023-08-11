import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, useResponsiveLayout } from "ui";

import { Brand } from "./brand";
import { items } from "./menuItems";
import ProfileInfo from "../profile-info";
import { useMeAndSettingsContext } from "../providers/settings";

export const Sidebar = () => {
  const { settings, me, stats } = useMeAndSettingsContext();
  const pathname = usePathname();
  const { isMobileOrTablet, setSidebarVisible } = useResponsiveLayout();

  return (
    <div className="h-full shadow-lg">
      <div className=" h-full flex-1 p-4">
        <Brand site_name={settings?.site_title ?? ""} />
        <div
          className="sidebar-content  my-6 overflow-y-auto"
          style={{ height: "calc(100vh - 152px)" }}
        >
          <Menu
            Link={Link}
            onSelect={(e, key) => {
              if (key === "/logout") {
                e.preventDefault();
                signOut({
                  redirect: true,
                });
              }
              isMobileOrTablet && setSidebarVisible(false);
            }}
            selectedKey={pathname}
            items={items(stats)}
          />
        </div>
      </div>
      <ProfileInfo
        name={me?.name ?? ""}
        avatar={me?.avatar}
        site_url={settings?.site_url ?? ""}
      />
    </div>
  );
};
