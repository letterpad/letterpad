import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export const checkout = async () => {
    const body = {
        interval: "month",
        amount: 2000,
        plan: "Monthly",
        planDescription: "Subscribe for $20 per month",
    };

    const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        body: JSON.stringify(body, null),
        headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());

    const stripe = await stripePromise;

    await stripe?.redirectToCheckout({
        sessionId: res.id,
    });
};