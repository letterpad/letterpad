import Head from "next/head";

import { Result } from "@/components_v2/result";
const Unsubscribed = () => {
  if (typeof document === "undefined") {
    return null;
  }
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

Unsubscribed.isMessage = true;
export default Unsubscribed;
