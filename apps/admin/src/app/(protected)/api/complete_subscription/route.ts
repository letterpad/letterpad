import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";

import { getServerSession } from "@/graphql/context";
import { getRootUrl } from "@/shared/getRootUrl";


export async function GET(req: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.id || !session.user?.email) {
      const url = new URL(`login?callbackUrl=${getRootUrl()}/membership`, getRootUrl());
      return NextResponse.redirect(new URL(url, getRootUrl()).toString());
    }

    const params = new URL(req.url).searchParams;
    const session_id = params.get("session_id")!;
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

    if (stripeSession.customer_email !== session.user.email) {
      throw new Error("Sessions dont match")
    }
    if (!stripeSession.setup_intent) {
      throw new Error("No setup intent")
    }
    const setupIntent = await stripe.setupIntents.retrieve(stripeSession.setup_intent as string);
    const searchCustomer = await stripe.customers.search({
      query: `email:\'${session.user.email}\'`
    });

    const exisitingCustomer = searchCustomer.data.length === 1;
    let customerId = exisitingCustomer ? searchCustomer.data[0].id : null;

    if (!customerId) {
      const newCustomer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name!,
      }) as Stripe.Customer;
      customerId = newCustomer.id;

      await prisma?.membership.create({
        data: {
          stripe_customer_id: customerId,
          author: {
            connect: {
              id: session.user.id
            }
          }
        }
      })
    }

    const method = await stripe.paymentMethods.attach(setupIntent.payment_method as string, { customer: customerId });

    await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      payment_settings: {
        payment_method_types: ['card'],
      },
      default_payment_method: method.id,
      trial_period_days: exisitingCustomer ? undefined : 7,
    });

  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  return NextResponse.redirect(new URL("membership", getRootUrl()).toString());
};

