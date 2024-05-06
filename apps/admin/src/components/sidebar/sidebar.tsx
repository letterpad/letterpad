"use client";

import dayjs from "dayjs";
import { useHomeQueryQuery } from "letterpad-graphql/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Menu, useResponsiveLayout } from "ui";

import { useMembershipDetails } from "@/hooks/useIsPaidMember";

import { createCustomerAndAddTrial } from "@/actions";
import { EventAction, EventCategory, EventLabel, track } from "@/track";
import { isAuthor, isSettings, isStats } from "@/utils/type-guards";

import { Brand } from "./brand";
import { items } from "./menuItems";

export const Sidebar = () => {
  const [{ data }] = useHomeQueryQuery();
  const { update } = useSession();
  const membership = useMembershipDetails();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any>({});
  const pathname = usePathname();
  const { isDesktop, setSidebarVisible } = useResponsiveLayout();
  const settings = isSettings(data?.settings) ? data?.settings : null;
  const stats = isStats(data?.stats) ? data?.stats : null;
  const activePlan = isAuthor(data?.me) ? data?.me?.is_paid_member : false;

  const fetchMembership = () => {
    fetch("/api/membership")
      .then((res) => res?.json())
      .then(setDetails)
      .catch(() => setDetails({}));
  };

  useEffect(fetchMembership, []);

  const { invoice, customer } = details;
  const paymentLink = invoice?.hosted_invoice_url;
  const trialEnd = customer?.subscriptions?.data[0]?.trial_end * 1000;

  const current = dayjs(trialEnd);
  const remainingTrialDays = current.diff(new Date(), "day");

  const startTrial = async () => {
    if (isAuthor(data?.me)) {
      setLoading(true);
      const res = await createCustomerAndAddTrial(data?.me?.id);
      if (res) {
        await update({
          can_start_trial: false,
          membership: "trialing",
        });
      }
      setLoading(false);
      track({
        eventAction: EventAction.Click,
        eventCategory: EventCategory.Membership,
        eventLabel: EventLabel.TrialActivated,
      });
    }
  };
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
        {membership?.isTrialing && (
          <div className="rounded-lg border !border-slate-800 m-2 bg-black/20 shadow-sm max-w-[240px]">
            <div className="flex flex-col space-y-1.5 p-2 pt-0 md:p-4">
              <h3 className="text-md font-semibold leading-none tracking-tight text-slate-100">
                Letterpad Trial Active
              </h3>
              <p className="text-xs text-muted-foreground whitespace-normal">
                You have {remainingTrialDays} days left in your trial.
              </p>
            </div>
          </div>
        )}
        {membership?.canStartTrial && (
          <div className="rounded-lg border !border-slate-800 m-2 bg-black/20 shadow-sm max-w-[240px]">
            <div className="flex flex-col space-y-1.5 p-2 pt-0 md:p-4">
              <h3 className="text-md font-semibold leading-none tracking-tight text-slate-100">
                Start 7 days free trial
              </h3>
              <p className="text-xs text-muted-foreground whitespace-normal">
                Get access to all features of Letterpad for 7 days.
              </p>
            </div>
            <div className="p-2 pt-0 md:p-4 md:pt-0">
              <Button
                variant="success"
                size={"small"}
                onClick={startTrial}
                className="text-white"
                disabled={loading}
              >
                Start Trial
              </Button>
            </div>
          </div>
        )}
        {membership?.paymentDue && (
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
                onClick={() => (window.open(paymentLink), false)}
                className="text-white"
              >
                Upgrade {paymentLink}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
