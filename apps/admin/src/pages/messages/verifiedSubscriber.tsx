import Head from "next/head";
import { Result } from "ui";

const VerifiedSubscriber = () => {
  return (
    <>
      <Head>
        <title>Email Verified</title>
      </Head>
      <Result
        status="success"
        title="Email Verified"
        subTitle="Your email has been successfully verified. You have been subscribed to the blog."
      />
    </>
  );
};
VerifiedSubscriber.isMessage = true;
export default VerifiedSubscriber;
