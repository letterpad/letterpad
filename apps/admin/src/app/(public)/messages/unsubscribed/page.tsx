"use client";
import Head from "next/head";
import { Result } from "ui";

const Unsubscribed = () => {
  const queryParams = new URLSearchParams(document.location.search);
  const msg =
    queryParams.get("msg") || "Your email has been removed from our system";
  return (
    <>
      <Head>
        <title>Unsubscribed successfully</title>
      </Head>
      <Result
        status="success"
        title="Unsubscribed successfully"
        subTitle={msg}
      />
    </>
  );
};

export default Unsubscribed;
