import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import {
  AMMOUNT,
  CURRENCY,
  formatAmountForStripe,
} from "@/components/payments/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }
  try {
    const current_intent = await stripe.paymentIntents.retrieve(
      process.env.STRIPE_PRICE_ID!
    );
    // If PaymentIntent has been created, just update the amount.
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        process.env.STRIPE_PRICE_ID!,
        {
          amount: formatAmountForStripe(AMMOUNT, CURRENCY),
        }
      );
      res.status(200).json(updated_intent);
      return;
    }
  } catch (e) {
    if ((e as any).code !== "resource_missing") {
      const errorMessage =
        e instanceof Error ? e.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
      return;
    }
  }

  try {
    // Create PaymentIntent from body params.
    const params: Stripe.PaymentIntentCreateParams = {
      amount: formatAmountForStripe(AMMOUNT, CURRENCY),
      currency: CURRENCY,
      description: process.env.STRIPE_PAYMENT_DESCRIPTION ?? "",
      automatic_payment_methods: {
        enabled: true,
      },
    };
    const payment_intent: Stripe.PaymentIntent =
      await stripe.paymentIntents.create(params);

    res.status(200).json(payment_intent);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
}
