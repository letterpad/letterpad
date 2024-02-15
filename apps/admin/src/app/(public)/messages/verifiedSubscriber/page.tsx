"use client";
import { Result } from "ui";

const VerifiedSubscriber = () => {
  return (
    <>
      <Result
        status="success"
        title="Email Verified"
        subTitle="Your email has been successfully verified. You have been subscribed to the blog."
      />
    </>
  );
};
export default VerifiedSubscriber;
