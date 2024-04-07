"use client";

import { useHomeQueryQuery } from "letterpad-graphql/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Menu, useResponsiveLayout } from "ui";

import { isMembershipFeatureActive } from "@/utils/config";

import { Brand } from "./brand";
import { items } from "./menuItems";
import { useIsPaidMember } from "../../hooks/useIsPaidMember";
import { isAuthor, isSettings, isStats } from "../../utils/type-guards";

export const Sidebar = () => {
  const [{ data }] = useHomeQueryQuery();
  const [paymentActive, setPaymentActive] = useState(false);
  const isPaidMember = useIsPaidMember();
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
    <div className="h-full shadow-lg text-slate-300">
      <div className="h-full flex flex-col ">
        <Brand site_name={settings?.site_title ?? ""} className="p-4" />
        <div className="sidebar-content p-4 overflow-y-auto font-paragraph text-sm flex-1">
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
        {!isPaidMember && (
          <div className="rounded-lg border !border-slate-800 m-2 bg-black/20 shadow-sm max-w-[240px]">
            <div className="flex flex-col space-y-1.5 p-2 pt-0 md:p-4">
              <h3 className="text-md font-semibold leading-none tracking-tight text-slate-100">
                Upgrade to <span className="text-orange-400">Pro</span>
              </h3>
              <p className="text-xs text-muted-foreground whitespace-normal">
                Unlock all features of Letterpad in just $5.
              </p>
            </div>
            <div className="p-2 pt-0 md:p-4 md:pt-0">
              <Button
                variant="success"
                size={"small"}
                onClick={() => (window.location.href = "/membership")}
                className="text-white"
              >
                Upgrade
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
