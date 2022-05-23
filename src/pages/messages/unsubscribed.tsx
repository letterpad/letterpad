import { Result } from "antd";
import Head from "next/head";
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

Unsubscribed.isStatic = true;
export default Unsubscribed;
