"use client";
import { Accordion } from "ui";

import { Heading } from "../features/headings";

const Trigger = ({ children }) => (
  <div className="text-lg font-heading">{children}</div>
);
const Content = ({ children }) => (
  <div className="text-md opacity-80 font-paragraph text-left">{children}</div>
);
export const Faq = () => {
  return (
    <div className="py-20">
      <Heading
        title="Frequently asked questions"
        description=""
        className="text-center"
      />
      <Accordion
        type="multiple"
        items={[
          {
            trigger: <Trigger>Is my money refundable?</Trigger>,
            content: (
              <Content>
                Yes. You can request a refund at any time within 3 days.
              </Content>
            ),
          },
          {
            trigger: <Trigger>Can I cancel my subscription?</Trigger>,
            content: (
              <Content>
                Yes. You can cancel your subscription at any time.
              </Content>
            ),
          },
          {
            trigger: (
              <Trigger>Do I need to pay extra for future updates?</Trigger>
            ),
            content: (
              <Content>
                No. All updates are included in your subscription.
              </Content>
            ),
          },
          {
            trigger: <Trigger>Do you have a free plan?</Trigger>,
            content: (
              <Content>
                Yes. We have a free plan that includes basic features.
              </Content>
            ),
          },
          {
            trigger: <Trigger>Do you offer free trial?</Trigger>,
            content: (
              <Content>
                No. Since we have a refund policy, we do not offer a free trial.
              </Content>
            ),
          },
          {
            trigger: <Trigger>Which payment methods do you accept?</Trigger>,
            content: (
              <Content>
                We securely accept credit card payments from all countries.
              </Content>
            ),
          },
        ]}
      />
    </div>
  );
};
