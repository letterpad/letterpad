import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FC } from "react";
import { Menu, useResponsiveLayout } from "ui";

// import { HomeQueryQuery } from "../../../__generated__/queries/queries.graphql";
import { Brand } from "./brand";
import { items } from "./menuItems";
import ProfileInfo from "../profile-info";
import { HomeQueryQuery } from "../../graphql/queries/queries.graphql";

interface Props {
  settings?: HomeQueryQuery["settings"];
  me?: HomeQueryQuery["me"];
  stats?: HomeQueryQuery["stats"];
}

export const Sidebar: FC<Props> = ({ settings, stats, me }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobileOrTablet, setSidebarVisible } = useResponsiveLayout();
  const s = settings?.__typename === "Setting" ? settings : null;
  const _me = me?.__typename === "Author" ? me : null;
  const _stats = stats?.__typename === "Stats" ? stats : null;

  return (
    <div className="h-full shadow-lg">
      <div className=" h-full flex-1 p-4">
        <Brand site_name={s?.site_title ?? ""} />
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
            items={items(_stats)}
          />
        </div>
      </div>
      <ProfileInfo
        name={_me?.name ?? ""}
        avatar={_me?.avatar}
        site_url={s?.site_url ?? ""}
      />
    </div>
  );
};
