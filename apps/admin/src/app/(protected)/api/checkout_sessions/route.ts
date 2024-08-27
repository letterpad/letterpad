import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";

import { getServerSession } from "@/graphql/context";
import { getRootUrl } from "@/shared/getRootUrl";

export async function POST() {
  const session = await getServerSession();

  if (!session || !session.user?.id || !session.user?.email) {
    const url = new URL(
      `login?callbackUrl=${getRootUrl()}/membership`,
      getRootUrl()
    );
    return NextResponse.redirect(new URL(url, getRootUrl()).toString());
  }
  const email = session.user.email;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      customer_email: email,
      payment_method_types: ["card"],
      setup_intent_data: {
        metadata: { email },
      },
      customer_creation: "if_required",
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: new URL(
        "api/complete_subscription?session_id={CHECKOUT_SESSION_ID}",
        getRootUrl()
      ).toString(),
      cancel_url: new URL("membership", getRootUrl()).toString(),
    });
    return NextResponse.json({ id: session.id });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    if (error instanceof Stripe.errors.StripeError) {
      const { message } = error;
      return NextResponse.json({ message }, { status: error.statusCode });
    }
  }
}
