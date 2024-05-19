import Stripe from "stripe";

import { prisma } from "@/lib/prisma";


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});

export const createCustomer = async ({ id, email, name }) => {
  try {
    if (!email || !name) return;
    const customer: Stripe.Customer = await stripe.customers.create({
      email,
      name,
    });
    await prisma.membership.create({
      data: {
        stripe_customer_id: customer.id,
        author: {
          connect: {
            id,
          },
        },
      },
    });
    return customer;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  }
};

export const createSubscriptionWithTrial = async ({
  customerId,
}: {
  customerId: string;
}) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: process.env.STRIPE_PRICE_ID }],
    trial_period_days: 7,
  });

  return subscription;
};
