"use client";
import { Result } from "ui";

const Unsubscribed = () => {
  const queryParams = new URLSearchParams(document.location.search);
  const msg =
    queryParams.get("msg") || "Your email has been removed from our system";
  return (
    <>
      <Result
        status="success"
        title="Unsubscribed successfully"
        subTitle={msg}
      />
    </>
  );
};

export default Unsubscribed;
