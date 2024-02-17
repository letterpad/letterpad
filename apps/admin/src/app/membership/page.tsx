"use client";
import { loadStripe } from "@stripe/stripe-js";
import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Button, Content, PageHeader, Table } from "ui";

import { formatAmountForDisplay } from "@/components/payments/utils";

import { basePath } from "@/constants";
import { SessionData } from "@/graphql/types";
import { getReadableDate } from "@/shared/utils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type P = InferGetServerSidePropsType<any>;
interface Props {
  session: SessionData;
}
const Payments: FC<P & Props> = () => {
  const [membership, setMembership] = useState<any>({});

  const { customer, charges, active } = membership;

  useEffect(() => {
    fetch("/api/membership")
      .then((res) => res.json())
      .then(setMembership);
  }, []);

  const handleClick = async (_event) => {
    const body = {
      interval: "month",
      amount: 2000,
      plan: "Monthly",
      planDescription: "Subscribe for $20 per month",
    };

    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      body: JSON.stringify(body, null),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());

    const stripe = await stripePromise;

    await stripe?.redirectToCheckout({
      sessionId: res.id,
    });
  };

  const deleteSubscription = async () => {
    const id = customer?.subscriptions?.data[0]?.id;
    if (!id) return;
    fetch(basePath + "/api/cancel-membership", {
      method: "POST",
      body: JSON.stringify({ subscription_id: id }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  };

  return (
    <>
      <Head>
        <title>Membership</title>
      </Head>
      <PageHeader className="site-page-header" title="Membership">
        <span className="help-text">
          This is where you can manage your payments.
        </span>
      </PageHeader>
      <Content>
        <input type="hidden" name="priceId" value="price_G0FvDp6vZvdwRZ" />
        <div className="flex items-center justify-between">
          <p>
            <span className="font-bold">Status:</span>
            <span className={classNames("font-medium ml-1")}>
              {active ? (
                <span className="text-white bg-green-600 text-xs px-2 py-1 rounded-md">
                  Active
                </span>
              ) : (
                <span className="text-white bg-red-600 text-xs px-2 py-1 rounded-md">
                  Inactive
                </span>
              )}
            </span>
          </p>
          {active ? (
            <Button onClick={deleteSubscription} variant="outline" size="small">
              Cancel Subscription
            </Button>
          ) : (
            <Button type="submit" onClick={handleClick}>
              Subscribe
            </Button>
          )}
        </div>
        {active && (
          <Table
            loading={false}
            columns={[
              {
                key: "date",
                title: "Date",
                dataIndex: "date",
              },
              {
                key: "ammount",
                title: "Ammount",
                dataIndex: "ammount",
              },
              {
                key: "plan",
                title: "Plan",
                dataIndex: "plan",
                render: () => {
                  return (
                    <span className="text-white bg-green-600 text-xs px-2.5 py-1 rounded-md">
                      PRO
                    </span>
                  );
                },
              },
              {
                key: "receipt_url",
                title: "Receipt",
                dataIndex: "receipt_url",
                render: (url) => {
                  return (
                    <Link href={url} target="_blank" className="text-blue-600">
                      Receipt
                    </Link>
                  );
                },
              },
              {
                key: "status",
                title: "Status",
                dataIndex: "status",
              },
            ]}
            dataSource={charges?.data.map((item) => ({
              date: getReadableDate(item.created * 1000),
              status: item.status === "succeeded" ? "Paid" : "Failed",
              receipt_url: item.receipt_url,
              ammount: formatAmountForDisplay(item.amount, item.currency),
            }))}
          />
        )}
      </Content>
    </>
  );
};

export default Payments;
