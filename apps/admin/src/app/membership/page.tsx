"use client";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { FC, useEffect, useState } from "react";
import { Content, PageHeader, TablePlaceholder } from "ui";

import { SessionData } from "@/graphql/types";

import { ActiveMember } from "./active-member";
import { PricingTable } from "../(public)/pricing/pricing-table";

type P = InferGetServerSidePropsType<any>;
interface Props {
  session: SessionData;
}
const Payments: FC<P & Props> = () => {
  const [membership, setMembership] = useState<any>({});
  const [fetching, setFetching] = useState(true);
  const { active } = membership;

  useEffect(() => {
    fetch("/api/membership")
      .then((res) => res.json())
      .then(setMembership)
      .then(() => setFetching(false))
      .catch(() => setFetching(false));
  }, []);

  return (
    <>
      <Head>
        <title>Membership</title>
      </Head>
      <PageHeader className="site-page-header" title="Membership">
        <span className="help-text">
          Get the most out of letterpad with a membership. Get access to all
          features and priority support.
        </span>
      </PageHeader>
      <Content>
        {fetching ? (
          <TablePlaceholder loading={true} />
        ) : active ? (
          <ActiveMember membership={membership} />
        ) : (
          <div className="py-8 px-4 mx-auto max-w-screen-md lg:py-16 lg:px-6">
            <PricingTable hasSession={true} showFreeTier={false} />
          </div>
        )}
      </Content>
    </>
  );
};

export default Payments;
