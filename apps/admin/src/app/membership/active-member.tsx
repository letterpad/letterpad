import classNames from "classnames";
import Link from "next/link";
import { Button, Table } from "ui";

import { formatAmountForDisplay } from "@/components/payments/utils";

import { getReadableDate } from "@/shared/utils";

import { checkout } from "./checkout";
import { basePath } from "../../constants";

export const ActiveMember = ({ membership }) => {
  const { customer, charges, active } = membership;

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
          <Button type="submit" onClick={checkout}>
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
    </>
  );
};
