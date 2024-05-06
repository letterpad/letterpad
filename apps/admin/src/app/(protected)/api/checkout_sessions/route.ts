import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { createCustomer, stripe } from "@/lib/stripe";

import { getServerSession } from "@/graphql/context";
import { getRootUrl } from "@/shared/getRootUrl";

// import { createCustomer } from "./createCustomer";


export async function POST(req: Request) {
  const session = await getServerSession({ req });

  if (!session || !session.user.id) {
    const url = new URL(`login?callbackUrl=${getRootUrl()}/membership`, getRootUrl());
    return NextResponse.redirect(new URL(url, getRootUrl()).toString());
  }
  const author = await prisma.membership.findFirst({
    where: {
      author: {
        id: session.user.id
      }
    },
  });
  let customerId: string | undefined | null = author?.stripe_customer_id;
  if (!author?.stripe_customer_id) {
    const customer = await createCustomer(session.user);
    if (customer?.id) {
      customerId = customer.id;
    }
  }

  if (!customerId) {
    return NextResponse.json({ message: "Failed to create customer Id" }, { status: 501 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: new URL('membership?session_id={CHECKOUT_SESSION_ID}', getRootUrl()).toString(),
      cancel_url: new URL('membership', getRootUrl()).toString(),
    });

    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      const { message } = error;
      return NextResponse.json({ message }, { status: error.statusCode });
    }
  }
};

