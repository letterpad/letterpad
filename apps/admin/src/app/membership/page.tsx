"use client";
import confetti from "canvas-confetti";
import { InferGetServerSidePropsType } from "next";
import { FC, useEffect, useRef, useState } from "react";
import { Content, TablePlaceholder } from "ui";
import { PageHeader } from "ui/isomorphic";

import { SessionData } from "@/graphql/types";

import { ActiveMember } from "./active-member";
import { PricingTable } from "../(public)/pricing/pricing-table";

confetti.Promise = Promise;

type P = InferGetServerSidePropsType<any>;
interface Props {
  session: SessionData;
}
const Payments: FC<P & Props> = () => {
  const [membership, setMembership] = useState<any>({});
  const [fetching, setFetching] = useState(true);
  const { active, status } = membership;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("/api/membership")
      .then((res) => res.json())
      .then(setMembership)
      .then(() => setFetching(false))
      .catch(() => setFetching(false));
  }, []);

  useEffect(() => {
    const node = canvasRef.current;
    if (!active || !node) return;
    node.style.display = "block";
    const myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });
    myConfetti({
      particleCount: 100,
      spread: 160,
      // any other options from the global
      // confetti function
    }).then(() => {
      node.style.display = "none";
    });
  }, [active]);

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
      <Content>
        {fetching && <TablePlaceholder loading={true} />}

        {!fetching && active && status !== "free"  && status !== "profree" &&
          <ActiveMember
            membership={membership}
            onCancel={() => {
              setMembership({ ...membership, active: false });
            }}
          />
        }
        {!fetching && status === "profree" && 
          <div className="text-blue-500 dark:bg-slate-800 bg-blue-100 p-4 font-paragraph rounded dark:border-slate-700 border-blue-200 border"><strong>✨ Congratulations! </strong>You have been provided with the Letterpad Pro membership for free.</div>
        }
        {!fetching &&  (status === "free" || status === "profree" || !active) && 
          <div className="py-8 px-4 mx-auto max-w-screen-md lg:py-16 lg:px-6">
            <PricingTable hasSession={true} showFreeTier={false} />
          </div>
        }
      </Content>
    </>
  );
};

export default Payments;
