import { NextApiResponse } from "next";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";

import { NextApiRequestWithFormData, SessionData } from "@/graphql/types";

import { getServerSession } from "../../../graphql/context";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});

const Create = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse
) => {
  const _session = await getServerSession({ req });
  const session = _session as unknown as { user: SessionData };
  if (!session || !session.user.id) return res.status(401).send("Unauthorized");
  const id: string = req.query.id as string;

  try {
    if (!id.startsWith("cs_")) {
      throw Error("Incorrect CheckoutSession ID.");
    }
    const checkout_session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.retrieve(id, {
        expand: ["payment_intent"],
      });

    await prisma.author.update({
      where: {
        id: session.user.id,
      },
      data: {
        stripe_customer_id: checkout_session.customer as string,
        stripe_subscription_id: checkout_session.subscription as string,
      },
    });

    res.status(200).json(checkout_session);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
};

export default Create;
