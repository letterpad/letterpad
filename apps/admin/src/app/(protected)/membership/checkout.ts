import { loadStripe } from "@stripe/stripe-js";

import { EventAction, EventCategory, EventLabel, track } from "../../../track";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export const checkout = async () => {
    const body = {
        interval: "month",
        amount: 2000,
        plan: "Monthly",
        planDescription: "Subscribe for $5 per month",
    };

    const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        body: JSON.stringify(body, null),
        headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());

    const stripe = await stripePromise;

    track({
        eventAction: EventAction.Click,
        eventCategory: EventCategory.Membership,
        eventLabel: EventLabel.Checkout,
    });

    return await stripe?.redirectToCheckout({
        sessionId: res.id,
    });
};