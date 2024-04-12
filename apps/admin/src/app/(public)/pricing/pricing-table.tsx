import classNames from "classnames";
import { IoMdCheckmark } from "react-icons/io";

import { CheckoutButton } from "./checkout-btn";

export const PricingTable = ({ hasSession, showFreeTier = true }) => {
  return (
    <div
      className={classNames(
        "space-y-4 lg:grid sm:gap-3 xl:gap-5 lg:space-y-0 font-heading",
        {
          "lg:grid-cols-1": !showFreeTier,
          "lg:grid-cols-2": showFreeTier,
        }
      )}
    >
      {showFreeTier && (
        <Item
          title="Free"
          items={[
            "Unlimited Posts",
            "Basic Analytics",
            "Earnings ( $3 / 1000 reads)",
            null,
            null,
            null,
            null,
            null,
          ]}
          action={
            <CheckoutButton
              label={`${hasSession ? "Select" : "Sign up for free"}`}
              hasSession={hasSession}
            />
          }
        />
      )}
      <Item
        title="Pro"
        items={[
          "AI Powered Editor",
          "Domain Mapping",
          "Entended Analytics",
          "Custom pages & photostory builder",
          "Custom Email Template",
          "Earnings 2x ( $6 / 1000 reads)",
          "Pro Badge",
          "Priority Support",
        ]}
        action={
          <CheckoutButton
            label={`${hasSession ? "Subscribe for $5/month" : "Sign up for $5/month"}`}
            freePlan={true}
            hasSession={hasSession}
          />
        }
      />
    </div>
  );
};

const Item = ({ items, title, action }) => {
  return (
    <div className="flex flex-col p-3 mx-auto max-w-sm text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-6 dark:bg-gray-800 dark:text-white w-full">
      <h3 className="mb-4 pb-2 text-lg font-semibold border-b dark:border-gray-700 border-gray-200">
        {title}
      </h3>
      <ul role="list" className="mb-8 space-y-1 text-left text-sm">
        {items.map((item) => (
          <li
            className="flex items-center space-x-2 font-paragraph h-6"
            key={item}
          >
            {item && <IoMdCheckmark size={14} className={"text-green-500"} />}
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {action}
    </div>
  );
};
