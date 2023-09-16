import { NextApiResponse } from "next";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";

import { basePath } from "@/constants";
import { NextApiRequestWithFormData } from "@/graphql/types";

const Create = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse
) => {
  if (req.method === "POST") {
    try {
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/${basePath}/membership/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/${basePath}/donate-with-checkout`,
      };
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default Create;
