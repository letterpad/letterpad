import { loadStripe } from "@stripe/stripe-js";
import { PageHeader } from "antd";
import Head from "next/head";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const Payments = ({ readOnly }: { readOnly: boolean }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/admin/api/payment_intents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const handleClick = async (event) => {
    const res = await fetch("/admin/api/checkout_session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
    const stripe = await stripePromise;
    const { error } = await stripe?.redirectToCheckout({
      sessionId: res.id,
    });
  };

  return (
    <>
      <Head>
        <title>Payments</title>
      </Head>
      <PageHeader className="site-page-header" title="Payments">
        <span className="help-text">
          This is where you can manage your payments.
        </span>
      </PageHeader>
      <div>
        <input type="hidden" name="priceId" value="price_G0FvDp6vZvdwRZ" />
        <button type="submit" onClick={handleClick}>
          Checkout
        </button>
      </div>
    </>
  );
};

export default Payments;
