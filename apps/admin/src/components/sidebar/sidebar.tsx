import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, useResponsiveLayout } from "ui";

import { useHomeQueryQuery } from "@/__generated__/src/graphql/queries/queries.graphql";

import { Brand } from "./brand";
import { items } from "./menuItems";
import { isAuthor, isSettings, isStats } from "../../utils/type-guards";

export const Sidebar = () => {
  const [{ data }] = useHomeQueryQuery();
  const pathname = usePathname();
  const { isMobileOrTablet, setSidebarVisible } = useResponsiveLayout();
  const settings = isSettings(data?.settings) ? data?.settings : null;
  const stats = isStats(data?.stats) ? data?.stats : null;
  const activePlan = isAuthor(data?.me) ? data?.me?.is_paid_member : false;
  return (
    <div className="h-full shadow-lg">
      <div className=" h-full flex-1 p-4">
        <Brand site_name={settings?.site_title ?? ""} />
        <div
          className="sidebar-content  my-6 overflow-y-auto font-paragraph"
          style={{ height: "calc(100vh - 152px)" }}
        >
          <Menu
            Link={Link}
            onSelect={async (e, key) => {
              if (key === "/logout") {
                e.preventDefault();
                await fetch(
                  `${document.location.origin}/api/identity/logout?source=
                    ${document.location.origin}`
                );
                signOut({
                  redirect: true,
                }).then(async () => {
                  window.location.href = "/login";
                });
              }
              isMobileOrTablet && setSidebarVisible(false);
            }}
            selectedKey={pathname}
            items={items(stats, activePlan)}
          />
        </div>
      </div>
    </div>
  );
};
