"use client";
import confetti from "canvas-confetti";
import dayjs from "dayjs";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Content, TablePlaceholder } from "ui/dist/index.mjs";
import { PageHeader } from "ui/dist/isomorphic.mjs";

import { SessionData } from "@/graphql/types";

import { ActiveMember } from "./active-member";
import { PricingTable } from "../../(public)/pricing/pricing-table";

confetti.Promise = Promise;

type P = InferGetServerSidePropsType<any>;

const Payments: FC<P & { session: SessionData }> = () => {
  const [membership, setMembership] = useState<any>({});
  const [fetching, setFetching] = useState(true);
  const { active } = membership;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { update, data: sessionData } = useSession();

  const fetchMembership = useCallback(async () => {
    try {
      const req = await fetch("/api/membership");
      const data = await req.json();
      setMembership(data);
      const lastSubscription = data.customer.subscriptions.data[0];
      if (
        lastSubscription &&
        sessionData?.user?.membership !== lastSubscription.status
      ) {
        await update({
          membership: lastSubscription.status,
          can_start_trial: false,
        });
        setFetching(false);
      }
    } catch (e) {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchMembership();
  }, [fetchMembership]);

  const showConfetti = useCallback(() => {
    const node = canvasRef.current;
    if (!active || !node) return;
    node.style.display = "block";
    const myConfetti = confetti.create(node, {
      resize: true,
      useWorker: true,
    });
    myConfetti({
      particleCount: 100,
      spread: 160,
    }).then(() => {
      node.style.display = "none";
    });
  }, [active]);

  useEffect(() => {
    showConfetti();
  }, [active, showConfetti]);

  const { invoice, customer } = membership;
  const paymentLink = invoice?.hosted_invoice_url;
  const subscriptionStatus = customer?.subscriptions?.data[0]?.status;
  const trialEnd = customer?.subscriptions?.data[0]?.trial_end * 1000;

  const current = dayjs(new Date());
  const remainingTrialDays = -current.diff(trialEnd, "day");

  const isLoading = fetching;
  const isActiveMember = active;
  const isNotFreeOrProFree =
    subscriptionStatus !== "free" && subscriptionStatus !== "profree";
  const isOnTrial = subscriptionStatus === "trialing";
  const isPastDue = subscriptionStatus === "past_due";
  const isProFree = subscriptionStatus === "profree";
  const hasNoActiveSubscription =
    subscriptionStatus === "free" ||
    subscriptionStatus === "profree" ||
    !isActiveMember;

  let visibleContent: ReactNode = null;

  if (isLoading) {
    visibleContent = <TablePlaceholder loading={true} />;
  } else if (isActiveMember && isNotFreeOrProFree) {
    visibleContent = (
      <ActiveMember
        membership={membership}
        onCancel={() => setMembership({ ...membership, active: false })}
      />
    );
  } else if (isOnTrial) {
    visibleContent = (
      <Alert
        content={`✨ You are using the trial version of Letterpad Pro. Your trial ends
          after ${remainingTrialDays} days.`}
      />
    );
  } else if (isPastDue) {
    visibleContent = (
      <Alert
        content="Your subscription is past due. Update your payment details."
        cta={
          <Link
            target="_blank"
            href={paymentLink}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 text-center mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Pay Now
          </Link>
        }
      />
    );
  } else if (isProFree) {
    visibleContent = (
      <Alert content="✨ Congratulations! You have been provided with the Letterpad Pro membership for free." />
    );
  } else if (hasNoActiveSubscription) {
    visibleContent = (
      <div className="py-8 px-4 mx-auto max-w-screen-md lg:py-16 lg:px-6">
        <PricingTable hasSession={true} showFreeTier={false} />
      </div>
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute h-full w-full left-0 top-0 hidden"
      ></canvas>
      <PageHeader className="site-page-header" title="Membership">
        <span className="help-text">
          Get the most out of letterpad with a membership. Get access to all
          features and priority support.
        </span>
      </PageHeader>
      <Content>{visibleContent}</Content>
    </>
  );
};

export default Payments;

const Alert: FC<{ content: string; cta?: ReactNode }> = ({ content, cta }) => {
  return (
    <div className="text-blue-500 dark:bg-slate-800 bg-blue-100 p-4 font-paragraph rounded dark:border-slate-700 border-blue-200 border flex flex-col md:flex-row justify-between">
      <div className="flex items-center gap-1">
        <IoIosInformationCircleOutline size={18} />
        {content}
      </div>
      <div>{cta}</div>
    </div>
  );
};
