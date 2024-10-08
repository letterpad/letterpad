/* eslint-disable no-console */
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";
import { EmailTemplates } from "@/graphql/types";

enum StripeWebhooks {
  Completed = "checkout.session.completed",
  PaymentFailed = "invoice.payment_failed",
  SubscriptionDeleted = "customer.subscription.deleted",
  SubscriptionUpdated = "customer.subscription.updated",
  SubscriptionCreated = "customer.subscription.created",
  PaymentSucceeded = "invoice.payment_succeeded",
  ChargeSucceeded = "charge.succeeded",
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { message: "No sig or no webhook secret" },
      { status: 400 }
    );
  }

  let event = {} as Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    if (err instanceof Error) {
      console.log(`❌ Error message: ${err.message}`);
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
  }

  try {
    switch (event.type) {
      case StripeWebhooks.PaymentSucceeded: {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        );

        await prisma.membership.update({
          where: {
            stripe_customer_id: invoice.customer as string,
          },
          data: {
            status: subscription.status as string,
          },
        });

        break;
      }
      case StripeWebhooks.PaymentFailed:
        console.log(event.data.object);
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        );
        const author = await prisma.author.findFirst({
          where: {
            email: invoice.customer_email as string,
          },
          select: { id: true },
        });
        if (!author) {
          break;
        }
        await prisma.membership.update({
          where: {
            stripe_customer_id: invoice.customer as string,
            author_id: author.id,
          },
          data: { status: subscription.status },
        });
        const invoice_url = invoice.hosted_invoice_url!;
        await enqueueEmailAndSend({
          template_id: EmailTemplates.PaymentFailed,
          author_id: author.id,
          invoice_url,
        });
        break;
      case StripeWebhooks.SubscriptionUpdated: {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = (await stripe.customers.retrieve(
          subscription.customer as string
        )) as Stripe.Customer;
        if (!customer.email) break;
        const author = await prisma.author.findUnique({
          where: { email: customer.email as string },
        });
        if (author) {
          await prisma.membership.update({
            where: {
              author_id: author.id,
            },
            data: {
              stripe_subscription_id: subscription.id,
              status: subscription.status,
            },
          });
        }
        break;
      }
      case StripeWebhooks.SubscriptionDeleted: {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.membership.update({
          where: {
            stripe_subscription_id: subscription.id,
          },
          data: {
            stripe_subscription_id: null,
            status: subscription.status,
          },
        });

        break;
      }
      case StripeWebhooks.SubscriptionCreated: {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = (await stripe.customers.retrieve(
          subscription.customer as string
        )) as Stripe.Customer;
        const author = await prisma?.author.findUnique({
          where: { email: customer.email as string },
        });
        if (author) {
          try {
            await prisma.membership.update({
              data: {
                status: subscription.status as string,
                stripe_customer_id: customer.id,
                stripe_subscription_id: subscription.id,
              },
              where: {
                author_id: author.id,
              },
            });
            console.log("Subscription created");
          } catch (err) {
            console.log("Web hook: Subscription created error", customer.email);
            console.log(err);
          }
        }
        console.log("✅  Subscription created successfully");
        break;
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
  }

  return NextResponse.json({ received: true });
}
