"use client";
import { useRouter } from "next/navigation";
import { Button, Result } from "ui";

const Verified = () => {
  const router = useRouter();
  const doLogin = () => {
    router.push("/api/auth/signin");
  };
  if (typeof document === "undefined") {
    return null;
  }
  const queryParams = new URLSearchParams(document.location.search);

  if (queryParams.get("msg")) {
    return <Result status="error" title={queryParams.get("msg") ?? ""} />;
  }
  return (
    <>
      <Result
        status="success"
        title="Email Verified"
        subTitle="Your email has been successfully verified with Letterpad. Click the below button to login"
        extra={[
          <Button key="login" onClick={doLogin}>
            Login
          </Button>,
        ]}
      />
    </>
  );
};
Verified.isMessage = true;
export default Verified;
