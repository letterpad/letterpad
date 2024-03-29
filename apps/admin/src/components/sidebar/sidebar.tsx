"use client";

import { useHomeQueryQuery } from "letterpad-graphql/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Menu, useResponsiveLayout } from "ui";

import { isMembershipFeatureActive } from "@/utils/config";

import { Brand } from "./brand";
import { items } from "./menuItems";
import { isAuthor, isSettings, isStats } from "../../utils/type-guards";

export const Sidebar = () => {
  const [{ data }] = useHomeQueryQuery();
  const [paymentActive, setPaymentActive] = useState(false);
  const pathname = usePathname();
  const { isDesktop, setSidebarVisible } = useResponsiveLayout();
  const settings = isSettings(data?.settings) ? data?.settings : null;
  const stats = isStats(data?.stats) ? data?.stats : null;
  const activePlan = isAuthor(data?.me) ? data?.me?.is_paid_member : false;
  const isActive = isMembershipFeatureActive();

  useEffect(() => {
    setPaymentActive(isActive);
  }, [isActive]);

  return (
    <div className="h-full shadow-lg">
      <div className=" h-full flex flex-col">
        <Brand site_name={settings?.site_title ?? ""} className="p-4"/>
        <div
          className="sidebar-content p-4 overflow-y-auto font-paragraph"
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
              !isDesktop && setSidebarVisible(false);
            }}
            selectedKey={pathname}
            items={items(stats, !!activePlan)}
          />
        </div>
        <style jsx global>{`
          .membership {
            display: ${paymentActive ? "block" : "none"};
          }
        `}</style>
      </div>
    </div>
  );
};
