import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = (await req.json()) as { subscription_id: string };
  const subscription_id = body.subscription_id as string;
  const response = await stripe.subscriptions.del(subscription_id);
  return NextResponse.json(response);
}
