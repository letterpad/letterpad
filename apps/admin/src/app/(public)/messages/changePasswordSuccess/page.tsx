"use client";
import { useRouter } from "next/navigation";
import { Button, Result } from "ui";

const ChangePasswordSuccess = () => {
  const router = useRouter();

  const doLogin = () => {
    router.push("/api/auth/signin");
  };
  return (
    <>
      <Result
        status="success"
        title="Password Changed"
        subTitle="Your password has been changed successfully"
        extra={[
          <Button key="login" onClick={doLogin}>
            Login
          </Button>,
        ]}
      />
    </>
  );
};

export default ChangePasswordSuccess;
