/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { prisma } from '@/lib/prisma';
import { stripe } from "@/lib/stripe";

enum StripeWebhooks {
    Completed = 'checkout.session.completed',
    PaymentFailed = 'invoice.payment_failed',
    SubscriptionDeleted = 'customer.subscription.deleted',
    SubscriptionUpdated = 'customer.subscription.updated',
    SubscriptionCreated = 'customer.subscription.created',
    PaymentSucceeded = 'payment_intent.succeeded',
    InvoiceSucceeded = 'invoice.payment_succeeded',
    ChargeSucceeded = 'charge.succeeded',
}

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
        return NextResponse.json({ message: "No sig or no webhook secret" }, { status: 400 });
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
            // case StripeWebhooks.PaymentSucceeded:
            // case StripeWebhooks.ChargeSucceeded:
            case StripeWebhooks.InvoiceSucceeded: {
                const invoice = event.data.object as Stripe.Invoice;
                const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
                const author = await prisma.author.findFirst({
                    where: {
                        email: invoice.customer_email as string
                    },
                    select: { id: true }
                });
                if (!author) {
                    break;
                }
                if (author) {
                    await prisma.membership.update({
                        where: {
                            author_id: author.id
                        },
                        data: {
                            status: subscription.status as string,
                        },
                    })
                }
                break;
            }
            case StripeWebhooks.PaymentFailed:
                const invoice = event.data.object as Stripe.Invoice;
                const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
                const author = await prisma.author.findFirst({
                    where: {
                        email: invoice.customer_email as string
                    },
                    select: { id: true }
                });
                if (!author) {
                    break;
                }
                await prisma.membership.update({
                    where: { stripe_customer_id: invoice.customer as string, author_id: author.id },
                    data: { status: subscription.status },
                });
                //todo: send email to the user
                break;
            case StripeWebhooks.SubscriptionUpdated:
                break;
            case StripeWebhooks.Completed: {
                const session = event.data.object as Stripe.Checkout.Session;
                const customer = await stripe.customers.retrieve(
                    session.customer as string,
                ) as Stripe.Customer;
                const author = await prisma.author.findUnique({ where: { email: customer.email as string } });
                if (author) {
                    await prisma.membership.update({
                        where: {
                            author_id: author.id
                        },
                        data: {
                            status: session.status as string,
                        },
                    })
                }
                break;
            }
            case StripeWebhooks.SubscriptionDeleted: {
                const subscription = event.data.object as Stripe.Subscription;
                const customer = await stripe.customers.retrieve(
                    subscription.customer as string,
                ) as Stripe.Customer;
                const author = await prisma.author.findUnique({ where: { email: customer.email as string } });
                if (author) {
                    await prisma.membership.update({
                        where: {
                            author_id: author.id
                        },
                        data: {
                            stripe_subscription_id: null,
                            status: subscription.status,
                        },
                    })
                }
                break;
            }
            case StripeWebhooks.SubscriptionCreated: {
                const subscription = event.data.object as Stripe.Subscription;
                const customer = await stripe.customers.retrieve(
                    subscription.customer as string,
                ) as Stripe.Customer;
                const author = await prisma?.author.findUnique({ where: { email: customer.email as string } });
                if (author) {
                    await prisma?.author.update({
                        where: { id: author.id },
                        data: {
                            membership: {
                                update: {
                                    data: {
                                        stripe_customer_id: customer.id,
                                        stripe_subscription_id: subscription.id,
                                        status: subscription.status,
                                    },
                                    where: {
                                        author_id: author.id
                                    }
                                },
                                connectOrCreate: {
                                    where: {
                                        author_id: author.id
                                    },
                                    create: {
                                        stripe_customer_id: customer.id,
                                        stripe_subscription_id: subscription.id,
                                        status: subscription.status,
                                    }
                                }
                            }
                        },
                    });
                }
                console.log('✅  Subscription created successfully');
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