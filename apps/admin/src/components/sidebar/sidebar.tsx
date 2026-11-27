"use client";

import dayjs from "dayjs";
import { useHomeQueryQuery } from "letterpad-graphql/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { Button } from "ui/dist/index.mjs";

import { useMembershipDetails } from "@/hooks/useIsPaidMember";

import { EventAction, EventCategory, EventLabel, track } from "@/track";
import { isAuthor, isSettings, isStats } from "@/utils/type-guards";

import { Brand } from "./brand";
import { accountItems, menuGroups } from "./menuItems";
import { checkout } from "../../app/(protected)/membership/checkout";

export const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const [{ data }] = useHomeQueryQuery();
  const membership = useMembershipDetails();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any>({});
  const pathname = usePathname();
  const settings = isSettings(data?.settings) ? data?.settings : null;
  const stats = isStats(data?.stats) ? data?.stats : null;

  const fetchMembership = () => {
    fetch("/api/membership")
      .then((res) => res?.json())
      .then(setDetails)
      .catch(() => setDetails({}));
  };

  useEffect(() => {
    setMounted(true);
    fetchMembership();
  }, []);

  const { invoice, customer } = details;
  const paymentLink = invoice?.hosted_invoice_url;
  const trialEnd = customer?.subscriptions?.data[0]?.trial_end * 1000;

  const current = dayjs(trialEnd);
  const remainingTrialDays = current.diff(new Date(), "day");

  const checkoutAndStartTrial = async () => {
    if (isAuthor(data?.me)) {
      setLoading(true);
      track({
        eventAction: EventAction.Click,
        eventCategory: EventCategory.Membership,
        eventLabel: EventLabel.Checkout,
      });
      await checkout();
      setLoading(false);
    }
  };
  const counts: Record<string, number | null | undefined> = {
    "/posts": stats?.posts?.published,
    "/creatives": stats?.pages?.published,
    "/tags": stats?.tags,
  };

  const renderItem = ({
    href,
    icon: Icon,
    label,
  }: (typeof accountItems)[number]) => (
    <li key={href}>
      <Link
        href={href}
        prefetch={false}
        aria-current={pathname === href ? "page" : undefined}
        className="workspace-nav-link"
        onClick={onNavigate}
      >
        <Icon aria-hidden="true" />
        <span>{label}</span>
        {mounted && counts[href] != null && (
          <span className="workspace-nav-count">
            {counts[href]}
            <span className="sr-only">
              {href === "/tags" ? " total" : " published"}
            </span>
          </span>
        )}
      </Link>
    </li>
  );

  return (
    <>
      <Brand
        siteName={mounted ? settings?.site_title : undefined}
        onNavigate={onNavigate}
      />
      <nav aria-label="Admin navigation" className="workspace-nav">
        {menuGroups.map(({ label, items }) => (
          <div key={label} className="workspace-nav-group">
            <h2 className="workspace-nav-heading">{label}</h2>
            <ul>{items.map(renderItem)}</ul>
          </div>
        ))}
        <ul className="workspace-account" aria-label="Account">
          {accountItems.map(renderItem)}
          <li>
            <button
              type="button"
              className="workspace-nav-link"
              data-testid="logout"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <FiLogOut aria-hidden="true" />
              Sign out
            </button>
          </li>
        </ul>
      </nav>
      <div className="workspace-membership">
        {membership?.isTrialing && (
          <div className="rounded-md border">
            <div className="flex flex-col space-y-1.5 p-2 pt-0 md:p-4">
              <h3 className="text-md font-semibold leading-none tracking-tight text-foreground">
                Letterpad Trial Active
              </h3>
              <p className="text-xs text-muted-foreground whitespace-normal">
                You have {remainingTrialDays} days left in your trial.
              </p>
            </div>
          </div>
        )}
        {membership?.canStartTrial && (
          <div className="rounded-md border">
            <div className="flex flex-col space-y-1.5 p-2 pt-0 md:p-4">
              <h3 className="text-md font-semibold leading-none tracking-tight text-foreground">
                Start 7 days free trial
              </h3>
              <p className="text-xs text-muted-foreground whitespace-normal">
                Get access to all features of Letterpad for 7 days.
              </p>
            </div>
            <div className="p-2 pt-0 md:p-4 md:pt-0">
              <Button
                size={"small"}
                onClick={checkoutAndStartTrial}
                className="workspace-primary-action"
                disabled={loading}
              >
                Start Trial
              </Button>
            </div>
          </div>
        )}
        {membership?.paymentDue && (
          <div className="rounded-md border">
            <div className="flex flex-col space-y-1.5 p-2 pt-0 md:p-4">
              <h3 className="text-md font-semibold leading-none tracking-tight text-foreground">
                Upgrade to <span className="text-orange-400">Pro</span>
              </h3>
              <p className="text-xs text-muted-foreground whitespace-normal">
                Unlock all features of Letterpad in just $5.
              </p>
            </div>
            <div className="p-2 pt-0 md:p-4 md:pt-0">
              <Button
                size={"small"}
                onClick={() => (window.open(paymentLink), false)}
                className="workspace-primary-action"
              >
                Upgrade
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
